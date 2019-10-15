import * as schedule from 'node-schedule';//跑定时任务的
import * as logger from 'winston';
import * as redis from '../lib/redisclient';
import { config } from '../config/config';
import * as utils from '../lib/utils';
import { CatalogsDao } from '../dao';

var rule = new schedule.RecurrenceRule();
rule.hour = [1, 7, 11, 13, 15, 17, 19, 21, 23];
rule.minute = 3;
rule.second = 33;

export function init() {
    schedule.scheduleJob(rule, syncCatalogReads); // 目录阅读数
    logger.info('node-schedule init OK.');
}

async function syncCatalogReads() {
    let key = config.vod.rds_reads;

    // 当目录数据太大，需要做批量操作 TODO
    let readKeys = await redis.hkeys(key);
    if (!utils.isArray(readKeys)) logger.error(`syncCatalogReads redis error!`);

    readKeys.forEach(async (el: any) => {
        let val = await redis.hget(key, el);
        if (val) {
            let result = await CatalogsDao.getInstance().updateReadsCount(el, val);
            if (!result) return;
            await redis.hdel(key, el);
        }
    });
}