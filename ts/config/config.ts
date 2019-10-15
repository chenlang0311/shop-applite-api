import * as path from 'path';
import * as logger from 'winston';
import { Op } from 'sequelize';

const operatorsAliases = {
	$eq: Op.eq,
	$ne: Op.ne,
	$gte: Op.gte,
	$gt: Op.gt,
	$lte: Op.lte,
	$lt: Op.lt,
	$not: Op.not,
	$in: Op.in,
	$notIn: Op.notIn,
	$is: Op.is,
	$like: Op.like,
	$notLike: Op.notLike,
	$iLike: Op.iLike,
	$notILike: Op.notILike,
	$regexp: Op.regexp,
	$notRegexp: Op.notRegexp,
	$iRegexp: Op.iRegexp,
	$notIRegexp: Op.notIRegexp,
	$between: Op.between,
	$notBetween: Op.notBetween,
	$overlap: Op.overlap,
	$contains: Op.contains,
	$contained: Op.contained,
	$adjacent: Op.adjacent,
	$strictLeft: Op.strictLeft,
	$strictRight: Op.strictRight,
	$noExtendRight: Op.noExtendRight,
	$noExtendLeft: Op.noExtendLeft,
	$and: Op.and,
	$or: Op.or,
	$any: Op.any,
	$all: Op.all,
	$values: Op.values,
	$col: Op.col
}

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
			logging: (d: any) => logger.verbose(d),
			operatorsAliases: operatorsAliases
		}
	},
	redis: {
		host: '127.0.0.1',
		port: 6379
	},
	imageHost: 'http://47.106.247.86:8002'
}

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
			logging: (d: any) => logger.verbose(d),
			operatorsAliases: operatorsAliases
		}
	},
	redis: {
		host: process.env.REDIS_IPV4 || 'localhost',
		port: 6379
	},
	imageHost: 'https://77dress.cn'
}

const iconfig = process.env.NODE_ENV === 'development' ? development : production;
const staticDir = path.join(path.resolve(__dirname, '../..'), 'public'); // 静态文件目录

export const config = {
	host: '127.0.0.1',
	port: iconfig.port,
	mysql: iconfig.mysql,
	redis: iconfig.redis,
	staticDir: staticDir,
	imageFolderTmp: path.join(staticDir, 'upload_tmp/images'),  // 图片上传临时目录
	imageFolder: path.join(staticDir, 'images'), // 图片目录
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
		rds_dk_pre: 'key:dk', // redis 缓存加密密钥  // 弃用，小程序不支持的hls播放音频
		refererKey: 'Ty5SP9NOR5wBZgnB5zXX', // 防盗链key
		refererExtTime: 7200 // 防盗链延长时间 单位：s
	},
	jwt: {
		secret: 'MYH0J%fft4F&7nT$ZmmhyoVi0mYzsvPK',
		expiresIn: '7d',
		long_expiresIn: '30d'
	},
	redisCache: {
		userInfoKey: '/user/info/user_id:', // 用户信息
		userInfoExpire: 600,
		classTotalKey: '/class/total', // 目录总数
		classTotalExpire: 3600,
		classLockedKey: '/calss/total/user_id:', // 解锁课程数目
		classLockedExpire: 3600,
		catalogLockedKey: '/catalog/total/user_id:', // 已解锁的目录数
		catalogLockedExpire: 3600
	}
}