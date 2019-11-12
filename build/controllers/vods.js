"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const logger = require("winston");
const redis = require("../lib/redisclient");
const config_1 = require("../config/config");
const qcapi_1 = require("../lib/qcapi");
const jwt_1 = require("../lib/jwt");
const dao_1 = require("../dao");
const utils = require("../lib/utils");
async function getKeyUrl(req, res, next) {
    // query中还包含keySource参数，代表密钥来源，now只能是点播内置KMS系统的加密
    let { fileId, edk, token } = req.query;
    if (!fileId || !edk || !token)
        return res.send();
    let user = jwt_1.jwtDecode(utils.base64Decode(token));
    if (!(user && user.sub))
        return res.send();
    let user_id = user.sub;
    let catelog = await dao_1.CatalogsDao.getInstance().findClassIdByFileid(fileId);
    if (!(catelog && catelog.class_id))
        return res.send();
    let record = await dao_1.RecordsDao.getInstance().findByUnique(user_id, catelog.class_id);
    if (!record)
        return res.send();
    let rds_dk = await redis.get(`${config_1.config.vod.rds_dk_pre}:${edk}`);
    if (rds_dk)
        return res.send(Buffer.from(rds_dk, 'base64'));
    let data = await qcapi_1.Qcapi.getInstance().request({
        Region: config_1.config.vod.defaultRegion,
        edkList: [edk],
        Action: 'DescribeDrmDataKey'
    });
    if (data && data.code === 0 && data.data && data.data.keyList && data.data.keyList[0]) {
        let dk = data.data.keyList[0].dk;
        if (dk)
            redis.set(`${config_1.config.vod.rds_dk_pre}:${edk}`, dk);
        return res.send(Buffer.from(dk, 'base64'));
    }
    let elog;
    try {
        elog = JSON.stringify(data);
    }
    catch (error) {
        elog = data;
    }
    logger.error(`[getKeyUrl]: get DescribeDrmDataKey fail, fileId: ${fileId}, data: ${elog}`);
    return res.send();
}
exports.getKeyUrl = getKeyUrl;

//# sourceMappingURL=../maps/controllers/vods.js.map
