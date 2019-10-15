import { Request, Response, NextFunction } from 'express';
import { SwipersDao } from '../dao';
import * as rediscache from '../lib/rediscache';
import * as utils from '../lib/utils';
import { config } from '../config/config';

export async function findSwiperList(req: Request, res: Response, next: NextFunction) {
    let { category } = req.query;
    if (!category) category = 'home';

    let redisKey = { category }
    let redis_results = await rediscache.getRedisCacheAboutReq(req, redisKey);
    if (redis_results && typeof redis_results === 'object') return res.sendOk(redis_results);

    let opts = {
        limit: 6,
        where: {
            state: 'normal',
            category: category
        },
        order: [['level', 'desc']]
    }

    let results = await SwipersDao.getInstance().findSwiperList(opts);
    if (!results) return res.sendErr('获取图片异常');

    results.map(item => {
        if (item.pic) item.pic = utils.picReplaceUrl(item.pic, config.imageHost);
        return item;
    });

    rediscache.setRedisCacheAboutReq(req, redisKey, results);
    return res.sendOk(results);
}