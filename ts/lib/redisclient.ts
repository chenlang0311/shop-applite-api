import * as Redis from 'ioredis';
import * as logger from 'winston';
import { config } from '../config/config';

const redisClient = new Redis({ host: config.redis.host, port: config.redis.port, family: 4, db: 0 });

redisClient.on('error', (e: any) => logger.error(`redis connect error : ${e}`));

redisClient.on('connect', () => logger.info('redis connect success!'));

export async function set(key: string, value: string, expire? : number) {
    try {
        if (expire && expire > 0) {
            return await redisClient.set(key, value, 'EX', expire);
        } else {
            return await redisClient.set(key, value);
        }
    } catch (e) {
        logger.error(`redis set error : ${e}`);
    }
}

export async function get(key: string) {
    try {
        return await redisClient.get(key);
    } catch (e) {
        logger.error(`redis get error : ${e}`);
    }

    return null;
}

export async function del(key: string) {
    try {
        return await redisClient.del(key);
    } catch (e) {
        logger.error(`redis del error : ${e}`);
    }

    return null;
}

export async function ttl(key: string) {
    try {
        return await redisClient.ttl(key);
    } catch (e) {
        logger.error(`redis ttl error : ${e}`);
    }

    return null;
}

export async function hset(key: string, field: string, val: string) {
    try {
        return await redisClient.hset(key, field, val);
    } catch (e) {
        logger.error(`redis hset error : ${e}`);
    }

    return null;
}

export async function hget(key: string, field: string) {
    try {
        return await redisClient.hget(key, field);
    } catch (e) {
        logger.error(`redis hget error : ${e}`);
    }

    return null;
}

export async function hkeys(key: string) {
    try {
        return await redisClient.hkeys(key);
    } catch (e) {
        logger.error(`redis hkeys error : ${e}`);
    }

    return null;
}

export async function hgetall(key: string) {
    try {
        return await redisClient.hgetall(key);
    } catch (e) {
        logger.error(`redis hgetall error : ${e}`);
    }

    return null;
}

export async function hdel(key: string, field: string) {
    try {
        return await redisClient.hdel(key, field);
    } catch (e) {
        logger.error(`redis hdel error : ${e}`);
    }

    return null;
}

export async function hmset(key: string, ...args: any[]) {
    try {
        return await redisClient.hmset(key, args);
    } catch (e) {
        logger.error(`redis hmset error : ${e}`);
    }

    return null;
}

export async function hlen(key: string) {
    try {
        return await redisClient.hlen(key);
    } catch (e) {
        logger.error(`redis hlen error : ${e}`);
    }

    return null;
}

export async function hmget(key: string, ...args: any[]) {
    try {
        return await redisClient.hmset(key, args);
    } catch (e) {
        logger.error(`redis hmget error : ${e}`);
    }

    return null;
}

export async function hexists(key: string, field: string) {
    try {
        return await redisClient.hexists(key, field);
    } catch (e) {
        logger.error(`redis hexists error : ${e}`);
    }

    return null;
}

export async function hincrby(key: string, field: string, increment: number = 1) {
    try {
        return await redisClient.hincrby(key, field, increment);
    } catch (e) {
        logger.error(`redis hincrby error : ${e}`);
    }

    return null;
}

export async function lpush(key: string, ...args: string[]): Promise<any>;
export async function lpush(key: string, arr: string[]): Promise<any>;
export async function lpush(key: any, arr: any) {
    try {
        return await redisClient.lpush(key, arr);
    } catch (e) {
        logger.error(`redis lpush error : ${e}`);
    }

    return null;
}

export async function rpush(key: string, ...args: string[]): Promise<any>;
export async function rpush(key: string, arr: string[]): Promise<any>;
export async function rpush(key: any, arr: any) {
    try {
        return await redisClient.rpush(key, arr);
    } catch (e) {
        logger.error(`redis rpush error : ${e}`);
    }

    return null;
}

export async function lpop(key: string) {
    try {
        return await redisClient.lpop(key);
    } catch (e) {
        logger.error(`redis lpop error : ${e}`);
    }

    return null;
}

export async function blpop(key: string, expire: number = 10) {
    try {
        return await redisClient.blpop(key, expire.toString());
    } catch (e) {
        logger.error(`redis blpop error : ${e}`);
    }

    return null;
}

export async function rpop(key: string) {
    try {
        return await redisClient.rpop(key);
    } catch (e) {
        logger.error(`redis rpop error : ${e}`);
    }

    return null;
}

export async function brpop(key: string, expire: number = 10) {
    try {
        return await redisClient.brpop(key, expire.toString());
    } catch (e) {
        logger.error(`redis brpop error : ${e}`);
    }

    return null;
}

export async function rpoplpush(key: string, bak: string) {
    try {
        return await redisClient.rpoplpush(key, bak);
    } catch (e) {
        logger.error(`redis rpoplpush error : ${e}`);
    }

    return null;
}

export async function llen(key: string) {
    try {
        return await redisClient.llen(key);
    } catch (e) {
        logger.error(`redis llen error : ${e}`);
    }

    return null;
}