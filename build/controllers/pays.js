"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const net = require("net");
const config_1 = require("../config/config");
const dao_1 = require("../dao");
const wxpay_1 = require("../lib/wxpay");
const utils = require("../lib/utils");
const wxutils = require("../lib/wxutils");
const rediscache = require("../lib/rediscache");
// 小程序支付
async function wxpay(req, res, next) {
    let user_id = req.jwtAccessToken ? req.jwtAccessToken.sub : null;
    if (!user_id)
        return res.sendErr('登录状态异常');
    let users = await dao_1.UsersDao.getInstance().findByPrimary(user_id);
    if (!(users && users.mini_openid))
        return res.sendErr('获取个人信息异常');
    let { class_id } = req.body;
    let classes = await dao_1.ClassesDao.getInstance().findByPrimary(class_id);
    if (!(classes && classes.price))
        return res.sendErr('课程信息异常');
    let wxpayOptions = {
        appid: config_1.config.weapp_auth.appid,
        mch_id: config_1.config.wxpay.mch_id,
        mch_key: config_1.config.wxpay.mch_key,
    };
    let wxpay = new wxpay_1.WXPay(wxpayOptions);
    let out_trade_no = wxpay_1.WXPay.getOutTradeNo(user_id);
    let ip = req.clientIP;
    let ipType = net.isIP(ip); // returns 0 for invalid, 4 for IPv4, and 6 for IPv6
    if (ipType !== 4)
        ip = '127.0.0.1';
    let opts = {
        total_fee: parseInt(classes.price),
        openid: users.mini_openid,
        notify_url: config_1.config.wxpay.notify_url,
        out_trade_no: out_trade_no,
        spbill_create_ip: ip,
        body: classes.title ? `重建自我-${utils.strCut(classes.title, 18)}` : '重建自我'
    };
    let results = await wxpay.unifiedOrder(opts);
    if (!(results && results.package))
        return res.sendErr('下单失败！');
    let prepay_id = results.package.split('=')[1];
    let order = await dao_1.OrdersDao.getInstance().createOrders({
        user_id: user_id,
        class_id: class_id,
        out_trade_no: out_trade_no,
        nonce_str: results.nonceStr,
        prepay_id: prepay_id,
        amount: classes.price
    });
    if (!order)
        return res.sendErr('创建订单失败！');
    results.order_id = order.id;
    return res.sendOk(results);
}
exports.wxpay = wxpay;
async function orderNotify(req, res, next) {
    let { order_id } = req.body;
    if (!order_id)
        return res.sendErr('参数缺失');
    let order = await dao_1.OrdersDao.getInstance().findByPrimary(order_id);
    if (!order)
        return res.sendErr('不存在的订单号');
    if (order.pay_status === 'success')
        return res.sendOk();
    let wxpay = new wxpay_1.WXPay({ appid: config_1.config.weapp_auth.appid, mch_id: config_1.config.wxpay.mch_id, mch_key: config_1.config.wxpay.mch_key });
    let payInfo = await wxpay.orderQuery({ 'out_trade_no': order.out_trade_no });
    if (!payInfo.status)
        return res.sendErr('支付异常');
    let pay = await dao_1.OrdersDao.getInstance().paySucess(order.out_trade_no, payInfo.transaction_id, payInfo.total_fee);
    if (!pay)
        return res.sendErr('数据异常');
    if (pay.doLogs) {
        rediscache.delRedisCache(pay.data.user_id, config_1.config.redisCache.classLockedKey); // 清除解锁课程redis缓存
        rediscache.delRedisCache(pay.data.user_id, config_1.config.redisCache.catalogLockedKey); // 清除解锁目录redis缓存
        // 可用mysql TRIGGER 触发器替换
        dao_1.ClassesDao.getInstance().updateUnlocksCount(pay.data.class_id); // 解锁+1
        dao_1.PayLogsDao.getInstance().create(pay.data); // 流水
    }
    return res.sendOk();
}
exports.orderNotify = orderNotify;
async function wxNotify(req, res, next) {
    let { xml } = req.body;
    let { return_code, err_code_des, out_trade_no, transaction_id, total_fee } = xml;
    res.set({ 'Content-Type': 'text/xml' });
    if (return_code !== 'SUCCESS')
        return res.send(wxutils.wxXmlReply(false, err_code_des));
    let signOk = wxpay_1.WXPay.checkSign(xml, config_1.config.wxpay.mch_key);
    if (!signOk)
        return res.send(wxutils.wxXmlReply(false, '签名失败'));
    let pay = await dao_1.OrdersDao.getInstance().paySucess(out_trade_no, transaction_id, total_fee);
    if (!pay)
        return res.send(wxutils.wxXmlReply(false, '更新失败'));
    if (pay.doLogs) {
        rediscache.delRedisCache(pay.data.user_id, config_1.config.redisCache.classLockedKey); // 清除解锁课程redis缓存
        rediscache.delRedisCache(pay.data.user_id, config_1.config.redisCache.catalogLockedKey); // 清除解锁目录redis缓存
        dao_1.ClassesDao.getInstance().updateUnlocksCount(pay.data.class_id); // 解锁+1
        dao_1.PayLogsDao.getInstance().create(pay.data); // 流水
    }
    return res.send(wxutils.wxXmlReply(true));
}
exports.wxNotify = wxNotify;

//# sourceMappingURL=../maps/controllers/pays.js.map
