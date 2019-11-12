"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const logger = require("winston");
const sequelize_1 = require("sequelize");
const operatorsAliases = {
    $eq: sequelize_1.Op.eq,
    $ne: sequelize_1.Op.ne,
    $gte: sequelize_1.Op.gte,
    $gt: sequelize_1.Op.gt,
    $lte: sequelize_1.Op.lte,
    $lt: sequelize_1.Op.lt,
    $not: sequelize_1.Op.not,
    $in: sequelize_1.Op.in,
    $notIn: sequelize_1.Op.notIn,
    $is: sequelize_1.Op.is,
    $like: sequelize_1.Op.like,
    $notLike: sequelize_1.Op.notLike,
    $iLike: sequelize_1.Op.iLike,
    $notILike: sequelize_1.Op.notILike,
    $regexp: sequelize_1.Op.regexp,
    $notRegexp: sequelize_1.Op.notRegexp,
    $iRegexp: sequelize_1.Op.iRegexp,
    $notIRegexp: sequelize_1.Op.notIRegexp,
    $between: sequelize_1.Op.between,
    $notBetween: sequelize_1.Op.notBetween,
    $overlap: sequelize_1.Op.overlap,
    $contains: sequelize_1.Op.contains,
    $contained: sequelize_1.Op.contained,
    $adjacent: sequelize_1.Op.adjacent,
    $strictLeft: sequelize_1.Op.strictLeft,
    $strictRight: sequelize_1.Op.strictRight,
    $noExtendRight: sequelize_1.Op.noExtendRight,
    $noExtendLeft: sequelize_1.Op.noExtendLeft,
    $and: sequelize_1.Op.and,
    $or: sequelize_1.Op.or,
    $any: sequelize_1.Op.any,
    $all: sequelize_1.Op.all,
    $values: sequelize_1.Op.values,
    $col: sequelize_1.Op.col
};
const development = {
    port: 8010,
    mysql: {
        database: 'classroom',
        username: 'root',
        password: '123456',
        options: {
            dialect: 'mysql',
            host: 'localhost',
            port: 3306,
            timezone: '+8:00',
            pool: {
                max: 5,
                min: 0,
                idle: 100000
            },
            logging: (d) => logger.verbose(d),
            operatorsAliases: operatorsAliases
        }
    },
    redis: {
        host: '127.0.0.1',
        port: 6379
    },
    imageHost: 'http://47.106.247.86:8002'
};
const production = {
    port: process.env.CLASSROOM_PORT || 8010,
    mysql: {
        database: process.env.MYSQL_DATABASE || 'classroom',
        username: 'root',
        password: process.env.MYSQL_ROOT_PASSWORD || '123456',
        options: {
            dialect: 'mysql',
            host: process.env.MYSQL_IPV4 || 'localhost',
            port: 3306,
            timezone: '+8:00',
            pool: {
                max: 5,
                min: 0,
                idle: 100000
            },
            logging: (d) => logger.verbose(d),
            operatorsAliases: operatorsAliases
        }
    },
    redis: {
        host: process.env.REDIS_IPV4 || 'localhost',
        port: 6379
    },
    imageHost: 'https://77dress.cn'
};
const iconfig = process.env.NODE_ENV === 'development' ? development : production;
const staticDir = path.join(path.resolve(__dirname, '../..'), 'public'); // 静态文件目录
exports.config = {
    host: '127.0.0.1',
    port: iconfig.port,
    mysql: iconfig.mysql,
    redis: iconfig.redis,
    staticDir: staticDir,
    imageFolderTmp: path.join(staticDir, 'upload_tmp/images'),
    imageFolder: path.join(staticDir, 'images'),
    imageHost: iconfig.imageHost,
    weapp_auth: {
        host: 'api.weixin.qq.com',
        path: '/sns/jscode2session',
        appid: 'wx8c5cc9d4373f01f4',
        secret: 'e7e75a6abbceb8944c1f474e3ecd3c28',
        grant_type: 'authorization_code',
        session_key_pre: 'key:sessionkey',
        session_key_expire: 3600,
    },
    wxpay: {
        mch_id: '1500521851',
        mch_key: 'ehcBr6FjZh99VBsTlqi3wUPEJX7RkuRl',
        notify_url: 'https://cjzw.topjinrong.net.cn/api/v1/pays/wxpay/notify',
        pfx_path: path.join(path.resolve(__dirname, '..'), 'apiclient_cert.p12')
    },
    vod: {
        secretId: 'AKIDENKFqGEnsofCvXvhJkwHPL6f55KjnZC7',
        secretKey: '2yjJsR3Vl6XovreFeifPZbT8DNM9zc3I',
        defaultRegion: 'gz',
        serviceType: 'vod',
        rds_reads: 'hash:catalog:reads',
        rds_dk_pre: 'key:dk',
        refererKey: 'Ty5SP9NOR5wBZgnB5zXX',
        refererExtTime: 7200 // 防盗链延长时间 单位：s
    },
    jwt: {
        secret: 'MYH0J%fft4F&7nT$ZmmhyoVi0mYzsvPK',
        expiresIn: '7d',
        long_expiresIn: '30d'
    },
    redisCache: {
        userInfoKey: '/user/info/user_id:',
        userInfoExpire: 600,
        classTotalKey: '/class/total',
        classTotalExpire: 3600,
        classLockedKey: '/calss/total/user_id:',
        classLockedExpire: 3600,
        catalogLockedKey: '/catalog/total/user_id:',
        catalogLockedExpire: 3600
    }
};

//# sourceMappingURL=../maps/config/config.js.map
