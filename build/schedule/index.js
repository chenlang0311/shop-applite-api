"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const schedule = require("node-schedule"); //跑定时任务的
const logger = require("winston");
const redis = require("../lib/redisclient");
const config_1 = require("../config/config");
const utils = require("../lib/utils");
const dao_1 = require("../dao");
var rule = new schedule.RecurrenceRule();
rule.hour = [1, 7, 11, 13, 15, 17, 19, 21, 23];
rule.minute = 3;
rule.second = 33;
function init() {
    schedule.scheduleJob(rule, syncCatalogReads); // 目录阅读数
    logger.info('node-schedule init OK.');
}
exports.init = init;
async function syncCatalogReads() {
    let key = config_1.config.vod.rds_reads;
    // 当目录数据太大，需要做批量操作 TODO
    let readKeys = await redis.hkeys(key);
    if (!utils.isArray(readKeys))
        logger.error(`syncCatalogReads redis error!`);
    readKeys.forEach(async (el) => {
        let val = await redis.hget(key, el);
        if (val) {
            let result = await dao_1.CatalogsDao.getInstance().updateReadsCount(el, val);
            if (!result)
                return;
            await redis.hdel(key, el);
        }
    });
}

//# sourceMappingURL=../maps/schedule/index.js.map
