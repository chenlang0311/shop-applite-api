import { myHttpRequest } from './http';
import * as utils from './utils';
import * as logger from 'winston';

interface WXPayOptions {
    appid: string; // 小程序appid
    mch_id: string; // 商户id
    mch_key: string; // 微信商户平台API密钥
    pfx?: any; // 微信商户平台证书
}

interface WXUrl {
    protocol: string;
    host: string;
    path: string;
}

interface unifiedOrderOptions {
    total_fee: string | number; // 订单总金额，单位为分
    openid: string; // 用户在商户appid下的唯一标识
    notify_url: string; // 异步接收微信支付结果通知的回调地址，通知url必须为外网可访问的url
    spbill_create_ip?: string; // APP和网页支付提交用户端ip，Native支付填调用微信支付API的机器IP
    out_trade_no?: string; // 商户系统内部订单号，要求32个字符内，只能是数字、大小写字母_-|*@ ，且在同一个商户号下唯一。
    nonce_str?: string; // 随机字符串，长度要求在32位以内
    sign_type?: string; // 签名类型，默认为MD5
    body?: string; // 商品简单描述
    fee_type?: string; // 符合ISO 4217标准的三位字母代码，默认人民币：CNY
    trade_type?: string; // 小程序取值如下：JSAPI
    limit_pay?: string; // 上传此参数no_credit--可限制用户不能使用信用卡支付
    // [propName: string]: any;
}

interface transfersOptions {
    openid: string;
    amount: string | number;
    spbill_create_ip?: string;
    nonce_str?: string;
    partner_trade_no?: string;
}

interface orderQueryOptions {
    nonce_str?: string;
    sign_type?: string;
}

interface orderQueryOptions1 extends orderQueryOptions {
    transaction_id: string // 微信订单号
}

interface orderQueryOptions2 extends orderQueryOptions {
    out_trade_no: string // 商户订单号
}

export class WXPay {
    // 微信下单
    private unifiedOrderUrl: WXUrl = {
        protocol: 'https', host: 'api.mch.weixin.qq.com', path: '/pay/unifiedorder'
    }
    // 查询订单
    private orderQueryUrl: WXUrl = {
        protocol: 'https', host: 'api.mch.weixin.qq.com', path: '/pay/orderquery'
    }
    // 微信提现
    private transfersUrl: WXUrl = {
        protocol: 'https', host: 'api.mch.weixin.qq.com', path: '/mmpaymkttransfers/promotion/transfers'
    }
    // 查询提现
    private transfersInfoUrl: WXUrl = {
        protocol: 'https', host: 'api.mch.weixin.qq.com', path: '/mmpaymkttransfers/gettransferinfo'
    }
    private appid: string;
    private mch_id: string;
    private mch_key: string;
    private pfx: any;

    constructor(options: WXPayOptions) {
        const { appid, mch_id, mch_key, pfx } = options;
        this.appid = appid;
        this.mch_id = mch_id;
        this.mch_key = mch_key;
        this.pfx = pfx;
    }

    private sign(options: any) {
        let stringA = utils.ObjToStringDictSort(options);
        let stringSignTemp = `${stringA}&key=${this.mch_key}`;
        let sign = utils.md5sum(stringSignTemp).toUpperCase();
        return sign;
    }

    public static getOutTradeNo(user_id?: string | number) {
        let timeStamp = new Date().getTime();
        let str = '';
        if (user_id) {
            str = utils.randomString(4).toUpperCase() + utils.prefixInteger(user_id, 7);
        } else {
            utils.randomString(11).toUpperCase();
        }

        return `${str}${timeStamp}`;
    }

    public static checkSign(options: any, mch_key: string, signKey: string = 'sign') {
        if (!(utils.isObject(options))) return false;
        let content: any = {};
        for (let key in options) if (key !== signKey) content[key] = options[key];

        let stringA = utils.ObjToStringDictSort(content);
        let stringSignTemp = `${stringA}&key=${mch_key}`;
        let sign = utils.md5sum(stringSignTemp).toUpperCase();

        return options[signKey] === sign;
    }

    public async unifiedOrder(options: unifiedOrderOptions) {
        const self = this;

        let { spbill_create_ip, out_trade_no, nonce_str, sign_type, body, fee_type, trade_type, limit_pay,
            total_fee, openid, notify_url } = options;

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
        }

        let content = utils.cloneObj(opts);
        content.sign = self.sign(opts);

        let myHttp = new myHttpRequest(self.unifiedOrderUrl.host, self.unifiedOrderUrl.path, self.unifiedOrderUrl.protocol);
        let xml = utils.obj2Xml(content);
        let order_results = await myHttp.postxml(xml);

        let order_results_obj = await utils.xml2Obj(order_results);
        let res = order_results_obj.xml;

        if (res && res.result_code === 'SUCCESS') {
            let opts: any = {
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
            }

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
    public async orderQuery(options: orderQueryOptions1 | orderQueryOptions2) {
        const self = this;
        let results = { status: false, transaction_id: '', total_fee: 0 }

        let { transaction_id, out_trade_no, nonce_str, sign_type } = options as any;
        let opts: any = {
            appid: self.appid,
            mch_id: self.mch_id,
            nonce_str: nonce_str ? nonce_str : utils.randomString(32),
            sign_type: sign_type ? sign_type : 'MD5'
        }

        if (transaction_id) {
            opts.transaction_id = transaction_id
        } else if (out_trade_no) {
            opts.out_trade_no = out_trade_no
        }

        let content = utils.cloneObj(opts);
        content.sign = self.sign(opts);

        let myHttp = new myHttpRequest(self.orderQueryUrl.host, self.orderQueryUrl.path, self.orderQueryUrl.protocol);
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

        if (transaction_id) logger.error(`[orderQuery] transaction_id:${transaction_id}`);
        if (out_trade_no) logger.error(`[orderQuery] out_trade_no:${out_trade_no}`);
        logger.error(`[orderQuery] ${JSON.stringify(res)}`);
        results.status = false;
        return results;
    }

    public async transfers(options: transfersOptions) {
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
        }

        let content = utils.cloneObj(opts);
        content.sign = self.sign(opts);

        let myHttp = new myHttpRequest(self.transfersUrl.host, self.transfersUrl.path, self.transfersUrl.protocol);
        let xml = utils.obj2Xml(content);
        let order_results = await myHttp.postxml(xml, { pfx: self.pfx, passphrase: self.mch_id });

        let order_results_obj = await utils.xml2Obj(order_results);
        let res = order_results_obj.xml;


        if (res && res.result_code === 'SUCCESS') {
            return {
                partner_trade_no: res.partner_trade_no,
                payment_no: res.payment_no,
                payment_time: res.payment_time,
            }
        }

        logger.error(`[transfers] ${JSON.stringify(res)}`);
        return null;
    }

    public async transfersInfo(options: { partner_trade_no: string, nonce_str?: string }) {
        const self = this;
        let { nonce_str, partner_trade_no } = options;

        let opts = {
            appid: self.appid,
            mch_id: self.mch_id,
            partner_trade_no: partner_trade_no,
            nonce_str: nonce_str ? nonce_str : utils.randomString(32),
        }

        let content = utils.cloneObj(opts);
        content.sign = self.sign(opts);

        let myHttp = new myHttpRequest(self.transfersInfoUrl.host, self.transfersInfoUrl.path, self.transfersInfoUrl.protocol);
        let xml = utils.obj2Xml(content);
        let order_results = await myHttp.postxml(xml, { pfx: self.pfx, passphrase: self.mch_id });

        let order_results_obj = await utils.xml2Obj(order_results);
        let res = order_results_obj.xml;

        if (res && res.result_code === 'SUCCESS') {
            return {
                partner_trade_no: res.partner_trade_no,
                payment_no: res.detail_id,
                payment_time: res.payment_time,
            }
        }

        logger.error(`[transfersInfo] ${JSON.stringify(res)}`);
        return null;
    }
}