import { Request, Response, NextFunction } from 'express';
import { CatalogsDao, UsersDao } from '../dao';
import { config } from '../config/config';
import * as utils from '../lib/utils';
import * as redis from '../lib/redisclient';
import * as rediscache from '../lib/rediscache';

export async function findCatalogDetails(req: Request, res: Response, next: NextFunction) {
    let { id } = req.params;
    let results = await CatalogsDao.getInstance().findByPrimary(id);
    if (!results) return res.sendErr('获取文稿失败');

    return res.sendOk({ content: results.content });
}

export async function updateCatalogCount(req: Request, res: Response, next: NextFunction) {
    let { id } = req.params;
    let { audition } = req.query;
    if (!id) return res.sendErr();

    let field = id.toString();
    await redis.hincrby(config.vod.rds_reads, field); // 统计课程阅读数

    let user_id = req.jwtAccessToken ? req.jwtAccessToken.sub : null;
    if (!user_id) return res.sendOk();

    if (audition === 'yes') return res.sendOk(); // 试听的不计入已学目录
    let { userInfoKey, userInfoExpire } = config.redisCache;
    let user = await rediscache.getRedisCache(user_id, userInfoKey); // 检查redis缓存
    if (!user) {
        user = await UsersDao.getInstance().findByPrimary(user_id);
        rediscache.setRedisCache(user_id, user, userInfoExpire, userInfoKey); // redis缓存
    }
    if (!user) return res.sendOk();

    let catalog_ids: string[];
    try {
        catalog_ids = JSON.parse(user.catalog_ids);
        if (!utils.isArray(catalog_ids)) catalog_ids = [];
    } catch (e) {
        catalog_ids = [];
    }

    let isSet = utils.inArray(field, catalog_ids);
    if (isSet) return res.sendOk();

    catalog_ids.push(field);
    await rediscache.delRedisCache(user_id, userInfoKey); // 需要更新记录时，先清除缓存
    await UsersDao.getInstance().updateUserInfo(user_id, { catalog_ids: JSON.stringify(catalog_ids) }); // 记录用户学习目录

    return res.sendOk();
}