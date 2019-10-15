"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils = require("../lib/utils");
const dao_1 = require("../dao");
const wxutils = require("../lib/wxutils");
const config_1 = require("../config/config");
const rediscache = require("../lib/rediscache");
async function findClassList(req, res, next) {
    return res.sendOk();
    let { page, count, category_id, order_by, order_sort, search } = req.query;
    let { offset, limit } = utils.getPageCount(page, count);
    let redisKey = { offset, limit, category_id, order_by, order_sort, search };
    let redis_results = await rediscache.getRedisCacheAboutReq(req, redisKey);
    if (redis_results && typeof redis_results === 'object') {
        res.property('total', redis_results.count);
        return res.sendOk(redis_results.rows);
    }
    let options = {
        offset: offset,
        limit: limit,
        where: {
            state: 'normal'
        },
        order: [['unlocks', 'desc']]
    };
    if (category_id && category_id != '0')
        options.where.category_id = category_id;
    if (order_by && order_sort)
        options.order = [[`${order_by}`, `${order_sort}`]];
    if (search && search !== '') {
        search = utils.trim(search);
        options.where.$or = [
            { title: { $like: `%${search}%` } },
            { abstract: { $like: `%${search}%` } },
            { author: { $like: `%${search}%` } },
            { author_abstract: { $like: `%${search}%` } }
        ];
    }
    let results = await ClassesDao.getInstance().findClassList(options);
    if (!results)
        return res.sendErr('获取列表失败！');
    let data = results.rows.map(r => {
        let item = r.get();
        let sum = 0;
        if (item.catalogs && item.catalogs.length > 0) {
            item.catalogs.forEach((el) => {
                if (el && utils.isRealNumber(el.duration))
                    sum += Number(el.duration);
            });
        }
        item.duration = sum;
        item.catalogs = item.catalogs ? item.catalogs.length : 0;
        if (item.virtual_unlocks || item.virtual_unlocks === 0) {
            item.unlocks = (item.unlocks ? item.unlocks : 0) + item.virtual_unlocks;
            delete item.virtual_unlocks;
        }
        if (item.cover_pic)
            item.cover_pic = utils.picReplaceUrl(item.cover_pic, config_1.config.imageHost);
        return item;
    });
    res.property('total', results.count);
    rediscache.setRedisCacheAboutReq(req, redisKey, { count: results.count, rows: data });
    return res.sendOk(data);
}
exports.findClassList = findClassList;
async function findClassDetails(req, res, next) {
    return res.sendOk();
    let locked = true;
    let { id } = req.params;
    let user_id = req.jwtAccessToken ? req.jwtAccessToken.sub : null;
    if (user_id) {
        let record = await dao_1.RecordsDao.getInstance().findByUnique(user_id, id);
        if (record)
            locked = false;
    }
    let results = await ClassesDao.getInstance().findClassDetails(id);
    if (!results)
        return res.sendErr('获取详情失败');
    if (results.state !== 'normal')
        return res.sendErr('该课程已下架');
    // 防盗链
    if (results.catalogs && utils.isArray(results.catalogs)) {
        let n_catalogs = [];
        let read_total = 0;
        results.catalogs.forEach((el) => {
            let element = el.get();
            if (element.virtual_reads || element.virtual_reads === 0) {
                element.reads = (element.reads ? (element.reads % 100) * 3 : 0) + element.virtual_reads;
                read_total += element.reads;
                delete element.virtual_reads;
            }
            if (locked === true && element.audition === 'no') {
                element.video_link = null;
                return n_catalogs.push(element);
            }
            if (element.video_link) {
                // 当前时间+延长时间+播放时长
                let rTime = element.audition === 'yes' ? 2592000 : config_1.config.vod.refererExtTime;
                let t = ((new Date().getTime() / 1000 << 0) + rTime + (element.duration ? element.duration : 0))
                    .toString(16).toLocaleLowerCase();
                let us = utils.randomString(10);
                let sign = wxutils.refererSign(config_1.config.vod.refererKey, element.video_link, t, us);
                element.video_link = `${element.video_link}?t=${t}&us=${us}&sign=${sign}`;
            }
            if (element.cover_pic)
                element.cover_pic = utils.picReplaceUrl(element.cover_pic, config_1.config.imageHost);
            return element.audition === 'yes' ? n_catalogs.splice(0, 0, element) : n_catalogs.push(element);
        });
        results.catalogs = n_catalogs;
        results.read_total = read_total;
    }
    if (results.cover_pic)
        results.cover_pic = utils.picReplaceUrl(results.cover_pic, config_1.config.imageHost);
    results.locked = locked;
    return res.sendOk(results);
}
exports.findClassDetails = findClassDetails;

//# sourceMappingURL=../maps/controllers/goods.js.map
