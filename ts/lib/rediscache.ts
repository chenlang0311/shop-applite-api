import { Request } from 'express';
import * as redis from './redisclient';
import * as utils from './utils';

export async function getRedisCacheAboutReq(req: Request, key: any) {
    let [baseurl, path] = [req.baseUrl, req.route.path];
    return await getRedisCache(key, `${baseurl}${path}:`);
}

export async function getRedisCache(key: any, keyPre?: string) {
    let r_key: string;
    if (utils.isObject(key)) r_key = utils.ObjToStringDictSort(key, true);
    if (utils.isString(key) || utils.isNumber(key)) r_key = key;
    if (!r_key) return null;

    let redisKey = keyPre ? `key:pagescache:${keyPre}${r_key}` : `key:pagescache:${r_key}`;
    let data = await redis.get(redisKey);
    let results: any;
    try { results = JSON.parse(data) } catch (e) { results = data }
    return results;
}

export async function setRedisCacheAboutReq(req: Request, key: any, vals: any, expire: number = 60) {
    let [baseurl, path] = [req.baseUrl, req.route.path];
    await setRedisCache(key, vals, expire, `${baseurl}${path}:`);
}

export async function setRedisCache(key: any, vals: any, expire: number = 60, keyPre?: string) {
    let r_key: string;
    if (utils.isObject(key)) r_key = utils.ObjToStringDictSort(key, true);
    if (utils.isString(key) || utils.isNumber(key)) r_key = key;
    if (!r_key) return null;
    let redisKey = keyPre ? `key:pagescache:${keyPre}${r_key}` : `key:pagescache:${r_key}`;

    let r_vals: string;
    try { r_vals = JSON.stringify(vals) } catch (e) { }
    if (!r_vals) return null;

    return await redis.set(redisKey, r_vals, expire);
}

export async function delRedisCacheAboutReq(req: Request, key: any) {
    let [baseurl, path] = [req.baseUrl, req.route.path];
    return await delRedisCache(key, `${baseurl}${path}:`);
}

export async function delRedisCache(key: any, keyPre?: string) {
    let r_key: string;
    if (utils.isObject(key)) r_key = utils.ObjToStringDictSort(key, true);
    if (utils.isString(key) || utils.isNumber(key)) r_key = key;
    if (!r_key) return null;

    let redisKey = keyPre ? `key:pagescache:${keyPre}${r_key}` : `key:pagescache:${r_key}`;
    return await redis.del(redisKey);
}

