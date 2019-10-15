import * as crypto from 'crypto';
import * as logger from 'winston';
import * as utils from './utils';
import * as url from 'url';

export function checkEncryptedDataSign(signature: string, session_key: string, rawData: string) {
    let signature1 = utils.sha1(rawData + session_key);
    return signature === signature1;
}

export function WXBizDataCrypt(sessionKey: string, encryptedData: string, iv: string, appid?: string) {
    let _sessionKey = Buffer.from(sessionKey, 'base64');
    let _encryptedData = Buffer.from(encryptedData, 'base64');
    let _iv = Buffer.from(iv, 'base64');

    try {
        // 解密
        let decipher = crypto.createDecipheriv('aes-128-cbc', _sessionKey, _iv);
        // 设置自动 padding 为 true，删除填充补位
        decipher.setAutoPadding(true);
        let decoded = decipher.update(_encryptedData, 'binary', 'utf8');
        decoded += decipher.final('utf8');

        let _decoded = JSON.parse(decoded);

        if (appid && _decoded.watermark.appid !== appid) {
            throw new Error('Illegal Buffer')
        }

        return _decoded;

    } catch (err) {
        logger.error(`[WXBizDataCrypt] error: ${err}`);
        return null;
        // throw new Error('Illegal Buffer')
    }
}

export function refererSign(key: string, link: string, t: string, us: string) {
    let pathname = url.parse(link).pathname;
    let dir = pathname.substring(0, pathname.lastIndexOf('/') + 1);
    let sign = utils.md5sum(`${key}${dir}${t}${us}`);
    return sign;
}

export function wxXmlReply(status: boolean, msg: string = 'fails') {
    if (status) return utils.obj2Xml({ return_code: 'SUCCESS', return_msg: 'OK' });
    return utils.obj2Xml({ return_code: 'FAIL', return_msg: msg });
}