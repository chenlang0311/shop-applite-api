"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Redis = require("ioredis");
const logger = require("winston");
const config_1 = require("../config/config");
const redisClient = new Redis({ host: config_1.config.redis.host, port: config_1.config.redis.port, family: 4, db: 0 });
redisClient.on('error', (e) => logger.error(`redis connect error : ${e}`));
redisClient.on('connect', () => logger.info('redis connect success!'));
async function set(key, value, expire) {
    try {
        if (expire && expire > 0) {
            return await redisClient.set(key, value, 'EX', expire);
        }
        else {
            return await redisClient.set(key, value);
        }
    }
    catch (e) {
        logger.error(`redis set error : ${e}`);
    }
}
exports.set = set;
async function get(key) {
    try {
        return await redisClient.get(key);
    }
    catch (e) {
        logger.error(`redis get error : ${e}`);
    }
    return null;
}
exports.get = get;
async function del(key) {
    try {
        return await redisClient.del(key);
    }
    catch (e) {
        logger.error(`redis del error : ${e}`);
    }
    return null;
}
exports.del = del;
async function ttl(key) {
    try {
        return await redisClient.ttl(key);
    }
    catch (e) {
        logger.error(`redis ttl error : ${e}`);
    }
    return null;
}
exports.ttl = ttl;
async function hset(key, field, val) {
    try {
        return await redisClient.hset(key, field, val);
    }
    catch (e) {
        logger.error(`redis hset error : ${e}`);
    }
    return null;
}
exports.hset = hset;
async function hget(key, field) {
    try {
        return await redisClient.hget(key, field);
    }
    catch (e) {
        logger.error(`redis hget error : ${e}`);
    }
    return null;
}
exports.hget = hget;
async function hkeys(key) {
    try {
        return await redisClient.hkeys(key);
    }
    catch (e) {
        logger.error(`redis hkeys error : ${e}`);
    }
    return null;
}
exports.hkeys = hkeys;
async function hgetall(key) {
    try {
        return await redisClient.hgetall(key);
    }
    catch (e) {
        logger.error(`redis hgetall error : ${e}`);
    }
    return null;
}
exports.hgetall = hgetall;
async function hdel(key, field) {
    try {
        return await redisClient.hdel(key, field);
    }
    catch (e) {
        logger.error(`redis hdel error : ${e}`);
    }
    return null;
}
exports.hdel = hdel;
async function hmset(key, ...args) {
    try {
        return await redisClient.hmset(key, args);
    }
    catch (e) {
        logger.error(`redis hmset error : ${e}`);
    }
    return null;
}
exports.hmset = hmset;
async function hlen(key) {
    try {
        return await redisClient.hlen(key);
    }
    catch (e) {
        logger.error(`redis hlen error : ${e}`);
    }
    return null;
}
exports.hlen = hlen;
async function hmget(key, ...args) {
    try {
        return await redisClient.hmset(key, args);
    }
    catch (e) {
        logger.error(`redis hmget error : ${e}`);
    }
    return null;
}
exports.hmget = hmget;
async function hexists(key, field) {
    try {
        return await redisClient.hexists(key, field);
    }
    catch (e) {
        logger.error(`redis hexists error : ${e}`);
    }
    return null;
}
exports.hexists = hexists;
async function hincrby(key, field, increment = 1) {
    try {
        return await redisClient.hincrby(key, field, increment);
    }
    catch (e) {
        logger.error(`redis hincrby error : ${e}`);
    }
    return null;
}
exports.hincrby = hincrby;
async function lpush(key, arr) {
    try {
        return await redisClient.lpush(key, arr);
    }
    catch (e) {
        logger.error(`redis lpush error : ${e}`);
    }
    return null;
}
exports.lpush = lpush;
async function rpush(key, arr) {
    try {
        return await redisClient.rpush(key, arr);
    }
    catch (e) {
        logger.error(`redis rpush error : ${e}`);
    }
    return null;
}
exports.rpush = rpush;
async function lpop(key) {
    try {
        return await redisClient.lpop(key);
    }
    catch (e) {
        logger.error(`redis lpop error : ${e}`);
    }
    return null;
}
exports.lpop = lpop;
async function blpop(key, expire = 10) {
    try {
        return await redisClient.blpop(key, expire.toString());
    }
    catch (e) {
        logger.error(`redis blpop error : ${e}`);
    }
    return null;
}
exports.blpop = blpop;
async function rpop(key) {
    try {
        return await redisClient.rpop(key);
    }
    catch (e) {
        logger.error(`redis rpop error : ${e}`);
    }
    return null;
}
exports.rpop = rpop;
async function brpop(key, expire = 10) {
    try {
        return await redisClient.brpop(key, expire.toString());
    }
    catch (e) {
        logger.error(`redis brpop error : ${e}`);
    }
    return null;
}
exports.brpop = brpop;
async function rpoplpush(key, bak) {
    try {
        return await redisClient.rpoplpush(key, bak);
    }
    catch (e) {
        logger.error(`redis rpoplpush error : ${e}`);
    }
    return null;
}
exports.rpoplpush = rpoplpush;
async function llen(key) {
    try {
        return await redisClient.llen(key);
    }
    catch (e) {
        logger.error(`redis llen error : ${e}`);
    }
    return null;
}
exports.llen = llen;

//# sourceMappingURL=../maps/lib/redisclient.js.map
