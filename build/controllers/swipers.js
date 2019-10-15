"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dao_1 = require("../dao");
const rediscache = require("../lib/rediscache");
const utils = require("../lib/utils");
const config_1 = require("../config/config");
async function findSwiperList(req, res, next) {
    let { category } = req.query;
    if (!category)
        category = 'home';
    let redisKey = { category };
    let redis_results = await rediscache.getRedisCacheAboutReq(req, redisKey);
    if (redis_results && typeof redis_results === 'object')
        return res.sendOk(redis_results);
    let opts = {
        limit: 6,
        where: {
            state: 'normal',
            category: category
        },
        order: [['level', 'desc']]
    };
    let results = await dao_1.SwipersDao.getInstance().findSwiperList(opts);
    if (!results)
        return res.sendErr('获取图片异常');
    results.map(item => {
        if (item.pic)
            item.pic = utils.picReplaceUrl(item.pic, config_1.config.imageHost);
        return item;
    });
    rediscache.setRedisCacheAboutReq(req, redisKey, results);
    return res.sendOk(results);
}
exports.findSwiperList = findSwiperList;

//# sourceMappingURL=../maps/controllers/swipers.js.map
