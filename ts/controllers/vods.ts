import { Request, Response, NextFunction } from 'express';
import * as logger from 'winston';
import * as redis from '../lib/redisclient';
import { config } from '../config/config';
import { Qcapi } from '../lib/qcapi';
import { jwtDecode } from '../lib/jwt';
import { CatalogsDao, RecordsDao } from '../dao'
import * as utils from '../lib/utils';

export async function getKeyUrl(req: Request, res: Response, next: NextFunction) {
    // query中还包含keySource参数，代表密钥来源，now只能是点播内置KMS系统的加密
    let { fileId, edk, token } = req.query;
    if (!fileId || !edk || !token) return res.send();
    let user = jwtDecode(utils.base64Decode(token));
    if (!(user && (user as any).sub)) return res.send();

    let user_id = (user as any).sub;
    let catelog = await CatalogsDao.getInstance().findClassIdByFileid(fileId);
    if (!(catelog && catelog.class_id)) return res.send();

    let record = await RecordsDao.getInstance().findByUnique(user_id, catelog.class_id);
    if (!record) return res.send();

    let rds_dk = await redis.get(`${config.vod.rds_dk_pre}:${edk}`);
    if (rds_dk) return res.send(Buffer.from(rds_dk, 'base64'));

    let data = await Qcapi.getInstance().request({
        Region: config.vod.defaultRegion,
        edkList: [edk],
        Action: 'DescribeDrmDataKey'
    })

    if (data && data.code === 0 && data.data && data.data.keyList && data.data.keyList[0]) {
        let dk = data.data.keyList[0].dk;
        if (dk) redis.set(`${config.vod.rds_dk_pre}:${edk}`, dk);
        return res.send(Buffer.from(dk, 'base64'));
    }

    let elog;
    try { elog = JSON.stringify(data) } catch (error) { elog = data }
    logger.error(`[getKeyUrl]: get DescribeDrmDataKey fail, fileId: ${fileId}, data: ${elog}`);
    return res.send();
}