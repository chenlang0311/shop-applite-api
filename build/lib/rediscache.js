"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const redis = require("./redisclient");
const utils = require("./utils");
async function getRedisCacheAboutReq(req, key) {
    let [baseurl, path] = [req.baseUrl, req.route.path];
    return await getRedisCache(key, `${baseurl}${path}:`);
}
exports.getRedisCacheAboutReq = getRedisCacheAboutReq;
async function getRedisCache(key, keyPre) {
    let r_key;
    if (utils.isObject(key))
        r_key = utils.ObjToStringDictSort(key, true);
    if (utils.isString(key) || utils.isNumber(key))
        r_key = key;
    if (!r_key)
        return null;
    let redisKey = keyPre ? `key:pagescache:${keyPre}${r_key}` : `key:pagescache:${r_key}`;
    let data = await redis.get(redisKey);
    let results;
    try {
        results = JSON.parse(data);
    }
    catch (e) {
        results = data;
    }
    return results;
}
exports.getRedisCache = getRedisCache;
async function setRedisCacheAboutReq(req, key, vals, expire = 60) {
    let [baseurl, path] = [req.baseUrl, req.route.path];
    await setRedisCache(key, vals, expire, `${baseurl}${path}:`);
}
exports.setRedisCacheAboutReq = setRedisCacheAboutReq;
async function setRedisCache(key, vals, expire = 60, keyPre) {
    let r_key;
    if (utils.isObject(key))
        r_key = utils.ObjToStringDictSort(key, true);
    if (utils.isString(key) || utils.isNumber(key))
        r_key = key;
    if (!r_key)
        return null;
    let redisKey = keyPre ? `key:pagescache:${keyPre}${r_key}` : `key:pagescache:${r_key}`;
    let r_vals;
    try {
        r_vals = JSON.stringify(vals);
    }
    catch (e) { }
    if (!r_vals)
        return null;
    return await redis.set(redisKey, r_vals, expire);
}
exports.setRedisCache = setRedisCache;
async function delRedisCacheAboutReq(req, key) {
    let [baseurl, path] = [req.baseUrl, req.route.path];
    return await delRedisCache(key, `${baseurl}${path}:`);
}
exports.delRedisCacheAboutReq = delRedisCacheAboutReq;
async function delRedisCache(key, keyPre) {
    let r_key;
    if (utils.isObject(key))
        r_key = utils.ObjToStringDictSort(key, true);
    if (utils.isString(key) || utils.isNumber(key))
        r_key = key;
    if (!r_key)
        return null;
    let redisKey = keyPre ? `key:pagescache:${keyPre}${r_key}` : `key:pagescache:${r_key}`;
    return await redis.del(redisKey);
}
exports.delRedisCache = delRedisCache;

//# sourceMappingURL=../maps/lib/rediscache.js.map
