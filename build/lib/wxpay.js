"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = require("./http");
const utils = require("./utils");
const logger = require("winston");
class WXPay {
    constructor(options) {
        // 微信下单
        this.unifiedOrderUrl = {
            protocol: 'https', host: 'api.mch.weixin.qq.com', path: '/pay/unifiedorder'
        };
        // 查询订单
        this.orderQueryUrl = {
            protocol: 'https', host: 'api.mch.weixin.qq.com', path: '/pay/orderquery'
        };
        // 微信提现
        this.transfersUrl = {
            protocol: 'https', host: 'api.mch.weixin.qq.com', path: '/mmpaymkttransfers/promotion/transfers'
        };
        // 查询提现
        this.transfersInfoUrl = {
            protocol: 'https', host: 'api.mch.weixin.qq.com', path: '/mmpaymkttransfers/gettransferinfo'
        };
        const { appid, mch_id, mch_key, pfx } = options;
        this.appid = appid;
        this.mch_id = mch_id;
        this.mch_key = mch_key;
        this.pfx = pfx;
    }
    sign(options) {
        let stringA = utils.ObjToStringDictSort(options);
        let stringSignTemp = `${stringA}&key=${this.mch_key}`;
        let sign = utils.md5sum(stringSignTemp).toUpperCase();
        return sign;
    }
    static getOutTradeNo(user_id) {
        let timeStamp = new Date().getTime();
        let str = '';
        if (user_id) {
            str = utils.randomString(4).toUpperCase() + utils.prefixInteger(user_id, 7);
        }
        else {
            utils.randomString(11).toUpperCase();
        }
        return `${str}${timeStamp}`;
    }
    static checkSign(options, mch_key, signKey = 'sign') {
        if (!(utils.isObject(options)))
            return false;
        let content = {};
        for (let key in options)
            if (key !== signKey)
                content[key] = options[key];
        let stringA = utils.ObjToStringDictSort(content);
        let stringSignTemp = `${stringA}&key=${mch_key}`;
        let sign = utils.md5sum(stringSignTemp).toUpperCase();
        return options[signKey] === sign;
    }
    async unifiedOrder(options) {
        const self = this;
        let { spbill_create_ip, out_trade_no, nonce_str, sign_type, body, fee_type, trade_type, limit_pay, total_fee, openid, notify_url } = options;
        let opts = {
            appid: self.appid,
            mch_id: self.mch_id,
            total_fee: total_fee,
            openid: openid,
            notify_url: notify_url,
            spbill_create_ip: spbill_create_ip ? spbill_create_ip : '127.0.0.1',
            out_trade_no: out_trade_no ? out_trade_no : WXPay.getOutTradeNo(),
            nonce_str: nonce_str ? nonce_str : utils.randomString(32),
            sign_type: sign_type ? sign_type : 'MD5',
            body: body ? body : '重建自我',
            fee_type: fee_type ? fee_type : 'CNY',
            trade_type: trade_type ? trade_type : 'JSAPI',
            limit_pay: limit_pay ? limit_pay : 'no_credit',
        };
        let content = utils.cloneObj(opts);
        content.sign = self.sign(opts);
        let myHttp = new http_1.myHttpRequest(self.unifiedOrderUrl.host, self.unifiedOrderUrl.path, self.unifiedOrderUrl.protocol);
        let xml = utils.obj2Xml(content);
        let order_results = await myHttp.postxml(xml);
        let order_results_obj = await utils.xml2Obj(order_results);
        let res = order_results_obj.xml;
        if (res && res.result_code === 'SUCCESS') {
            let opts = {
                appId: res.appid,
                nonceStr: utils.randomString(32),
                package: `prepay_id=${res.prepay_id}`,
                signType: `MD5`,
                timeStamp: new Date().getTime() / 1000 << 0
            };
            let stringB = utils.ObjToStringDictSort(opts);
            let paySign = utils.md5sum(`${stringB}&key=${self.mch_key}`).toUpperCase();
            let res_obj = {
                nonceStr: opts.nonceStr,
                package: opts.package,
                signType: opts.signType,
                timeStamp: opts.timeStamp,
                paySign: paySign
            };
            return res_obj;
        }
        logger.error(`[unifiedOrder] ${JSON.stringify(res)}`);
        return null;
    }
    /**
     * @param options
     * @returns string
     * FAIL--请求错误
     * SUCCESS--支付成功
     * REFUND--转入退款
     * NOTPAY--未支付
     * CLOSED--已关闭
     * REVOKED--已撤销（刷卡支付）
     * USERPAYING--用户支付中
     * PAYERROR--支付失败(其他原因，如银行返回失败)
     */
    async orderQuery(options) {
        const self = this;
        let results = { status: false, transaction_id: '', total_fee: 0 };
        let { transaction_id, out_trade_no, nonce_str, sign_type } = options;
        let opts = {
            appid: self.appid,
            mch_id: self.mch_id,
            nonce_str: nonce_str ? nonce_str : utils.randomString(32),
            sign_type: sign_type ? sign_type : 'MD5'
        };
        if (transaction_id) {
            opts.transaction_id = transaction_id;
        }
        else if (out_trade_no) {
            opts.out_trade_no = out_trade_no;
        }
        let content = utils.cloneObj(opts);
        content.sign = self.sign(opts);
        let myHttp = new http_1.myHttpRequest(self.orderQueryUrl.host, self.orderQueryUrl.path, self.orderQueryUrl.protocol);
        let xml = utils.obj2Xml(content);
        let order_results = await myHttp.postxml(xml);
        let order_results_obj = await utils.xml2Obj(order_results);
        let res = order_results_obj.xml;
        if (res && res.return_code === 'SUCCESS' && res.result_code === 'SUCCESS') {
            if (res.trade_state === 'SUCCESS') {
                let signOk = WXPay.checkSign(res, this.mch_key);
                if (!signOk) {
                    logger.error(`[orderQuery][checkSgin fail] ${JSON.stringify(res)}`);
                    results.status = false;
                    return results;
                }
            }
            results.status = res.trade_state === 'SUCCESS';
            results.transaction_id = res.transaction_id;
            results.total_fee = res.total_fee;
            return results;
        }
        if (transaction_id)
            logger.error(`[orderQuery] transaction_id:${transaction_id}`);
        if (out_trade_no)
            logger.error(`[orderQuery] out_trade_no:${out_trade_no}`);
        logger.error(`[orderQuery] ${JSON.stringify(res)}`);
        results.status = false;
        return results;
    }
    async transfers(options) {
        const self = this;
        let { openid, amount, spbill_create_ip, nonce_str, partner_trade_no } = options;
        let opts = {
            mch_appid: self.appid,
            mchid: self.mch_id,
            openid: openid,
            amount: amount,
            spbill_create_ip: spbill_create_ip ? spbill_create_ip : '127.0.0.1',
            nonce_str: nonce_str ? nonce_str : utils.randomString(32),
            partner_trade_no: partner_trade_no ? partner_trade_no : WXPay.getOutTradeNo(),
            check_name: 'NO_CHECK',
            desc: '余额提现',
        };
        let content = utils.cloneObj(opts);
        content.sign = self.sign(opts);
        let myHttp = new http_1.myHttpRequest(self.transfersUrl.host, self.transfersUrl.path, self.transfersUrl.protocol);
        let xml = utils.obj2Xml(content);
        let order_results = await myHttp.postxml(xml, { pfx: self.pfx, passphrase: self.mch_id });
        let order_results_obj = await utils.xml2Obj(order_results);
        let res = order_results_obj.xml;
        if (res && res.result_code === 'SUCCESS') {
            return {
                partner_trade_no: res.partner_trade_no,
                payment_no: res.payment_no,
                payment_time: res.payment_time,
            };
        }
        logger.error(`[transfers] ${JSON.stringify(res)}`);
        return null;
    }
    async transfersInfo(options) {
        const self = this;
        let { nonce_str, partner_trade_no } = options;
        let opts = {
            appid: self.appid,
            mch_id: self.mch_id,
            partner_trade_no: partner_trade_no,
            nonce_str: nonce_str ? nonce_str : utils.randomString(32),
        };
        let content = utils.cloneObj(opts);
        content.sign = self.sign(opts);
        let myHttp = new http_1.myHttpRequest(self.transfersInfoUrl.host, self.transfersInfoUrl.path, self.transfersInfoUrl.protocol);
        let xml = utils.obj2Xml(content);
        let order_results = await myHttp.postxml(xml, { pfx: self.pfx, passphrase: self.mch_id });
        let order_results_obj = await utils.xml2Obj(order_results);
        let res = order_results_obj.xml;
        if (res && res.result_code === 'SUCCESS') {
            return {
                partner_trade_no: res.partner_trade_no,
                payment_no: res.detail_id,
                payment_time: res.payment_time,
            };
        }
        logger.error(`[transfersInfo] ${JSON.stringify(res)}`);
        return null;
    }
}
exports.WXPay = WXPay;

//# sourceMappingURL=../maps/lib/wxpay.js.map
