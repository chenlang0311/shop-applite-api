import { Request, Response, NextFunction } from 'express';
import { UsersDao, RecordsDao, ClassesDao,GoodsDao } from '../dao';
import { config } from '../config/config';
import { myHttpRequest } from '../lib/http';
import { jwtEncode } from '../lib/jwt';
import * as utils from '../lib/utils';
import * as wxutils from '../lib/wxutils';
import * as redis from '../lib/redisclient';
import * as rediscache from '../lib/rediscache';

const wxconfig = config.weapp_auth;

export async function getUserInfo(req: Request, res: Response, next: NextFunction) {
    let user_id = req.jwtAccessToken ? req.jwtAccessToken.sub : null;
    if (!user_id) return res.sendErr('用户过期');

    let { userInfoKey, userInfoExpire, classTotalKey, classTotalExpire,
        catalogLockedKey, catalogLockedExpire, classLockedKey, classLockedExpire } = config.redisCache;
    let user = await rediscache.getRedisCache(user_id, userInfoKey); // 检查redis缓存
    if (!user) {
        user = await UsersDao.getInstance().findByPrimary(user_id);
        rediscache.setRedisCache(user_id, user, userInfoExpire, userInfoKey); // redis缓存
    }
    if (!user) return res.sendErr('不存在的用户');

    let catalog_ids: string[];
    try {
        catalog_ids = JSON.parse(user.catalog_ids);
        if (!utils.isArray(catalog_ids)) catalog_ids = [];
    } catch (e) {
        catalog_ids = [];
    }

    // 目录总数
    // let catalog_total = await rediscache.getRedisCache(catalogTotalKey);
    // if (!(catalog_total || catalog_total == 0)) {
    //     catalog_total = await CatalogsDao.getInstance().findCatalogTotal();
    //     rediscache.setRedisCache(catalogTotalKey, catalog_total, catalogTotalExpire);
    // }

    // 课程总数
    let class_total = await rediscache.getRedisCache(classTotalKey);
    if (!(class_total || class_total == 0)) {
        class_total = await ClassesDao.getInstance().findClassTotal();
        rediscache.setRedisCache(classTotalKey, class_total, classTotalExpire);
    }

    // 解锁课程数目
    let class_locked = await rediscache.getRedisCache(user_id, classLockedKey);
    if (!(class_locked || class_locked == 0)) {
        class_locked = await await RecordsDao.getInstance().findAcountClassByUserId(user_id);
        rediscache.setRedisCache(user_id, class_locked, classLockedExpire, classLockedKey);
    }

    // 解锁目录总数
    let catalog_locked = await rediscache.getRedisCache(user_id, catalogLockedKey);
    if (!(catalog_locked || catalog_locked == 0)) {
        catalog_locked = await RecordsDao.getInstance().findAcountCatalogByUserId(user_id);
        rediscache.setRedisCache(user_id, catalog_locked, catalogLockedExpire, catalogLockedKey);
    }

    let { id, username, nickname, avatarurl, gender, country, province, city, abstract,
        desc, readtime, modified, created } = user;
    let data: any = {
        id, username, nickname, avatarurl, gender, country, province, city, abstract,
        desc, readtime, modified, created
    };
    data.class_total = class_total ? class_total : 0;
    data.class_locked = class_locked ? class_locked : 0;
    data.catalog_read = catalog_ids.length;
    data.catalog_locked = catalog_locked ? catalog_locked : 0;

    return res.sendOk(data);
}

export async function setUserInfo(req: Request, res: Response, next: NextFunction) {
    let user_id = req.jwtAccessToken.sub;
    let { nickName, avatarUrl, gender, country, province, city } = req.body;
    let options = {
        nickname: nickName,
        avatarurl: avatarUrl,
        gender: gender,
        country: country,
        province: province,
        city: city
    }

    let results = await UsersDao.getInstance().updateUserInfo(user_id, options);
    if (!results) return res.sendErr('更新失败');

    return res.sendOk();
}

export async function weappLogin(req: Request, res: Response, next: NextFunction) {
    let code = req.query['code'];
    if (!code) return res.sendErr('验证错误，缺失的code');

    let authRequest = new myHttpRequest(wxconfig.host, wxconfig.path, 'https');
    let weapp = await authRequest.get({
        appid: wxconfig.appid,
        secret: wxconfig.secret,
        js_code: code,
        grant_type: wxconfig.grant_type
    });

    let results: any = null;
    try {
        results = JSON.parse(weapp);
    } catch (err) {
        res.property('errStack', err.stack);
        return res.sendErr('解析错误');
    }

    let openid = results.openid;
    let session_key = results.session_key;
    if (openid && session_key) {
        let openid_str = openid.substring(openid.length - 8);//截取后8位
        let time_str = new Date().getTime().toString().substring(5);//截取时间戳后五位
        let rds_session_key = `${openid_str}_${utils.randomString(6)}_${time_str}`;
        let rds_key = `${wxconfig.session_key_pre}:${rds_session_key}`;
        await redis.set(rds_key, session_key, wxconfig.session_key_expire);

        return res.sendOk({ rds_session_key: rds_session_key });
    }

    if (results.errcode) res.property('errcode', results.errcode);
    if (results.errmsg) res.property('errmsg', results.errmsg);
    return res.sendErr('请求失败');
}

export async function weappSign(req: Request, res: Response, next: NextFunction) {
    let { rds_session_key, encryptedData, iv, rawData, signature } = req.body;
    if (!rds_session_key) return res.sendErr('请求失败，缺少参数');

    let session_key = await redis.get(`${wxconfig.session_key_pre}:${rds_session_key}`);
    if (!session_key) return res.sendErr('session_key异常');

    let signOk = wxutils.checkEncryptedDataSign(signature, session_key, rawData);
    if (!signOk) return res.sendErr('数据异常');

    let weappUserInfo = wxutils.WXBizDataCrypt(session_key, encryptedData, iv);
    console.log("weappUserInfo-------------------", weappUserInfo)
    // if (!(weappUserInfo && weappUserInfo.unionId)) return res.sendErr('获取信息异常'); unionid需要绑定公众号
    if (!weappUserInfo) return res.sendErr('获取信息异常');
    let options = {
        unionid: weappUserInfo.unionId || weappUserInfo.openId,
        mini_openid: weappUserInfo.openId,
        nickname: weappUserInfo.nickName,
        gender: weappUserInfo.gender,
        city: weappUserInfo.city,
        province: weappUserInfo.province,
        country: weappUserInfo.country,
        avatarurl: weappUserInfo.avatarUrl
    }

    let user = await trySignUp(options);
    if (!(user && user.id)) return res.sendErr('服务异常');

    // 记录微信已知用户的session_key,以供后续使用
    await redis.set(`${wxconfig.session_key_pre}:user:${user.id}`, session_key, 86400);//86400==24小时

    let token = jwtEncode(user);
    return res.sendOk(token);
}

export async function findUserClassList(req: Request, res: Response, next: NextFunction) {
    let user_id = req.jwtAccessToken.sub;
    let { page, count } = req.query;
    let { offset, limit } = utils.getPageCount(page, count);

    let options: any = {
        offset: offset,
        limit: limit,
        attributes: ['id', 'class_id', 'amount'],
        where: {
            user_id: user_id
        },
        order: [['created', 'desc']]
    };
    let classList = await RecordsDao.getInstance().findByUserId(options);
    if (!classList) return res.sendErr('获取个人信息失败');

    let data: any[] = [];
    classList.rows.forEach(el => {
        let item = el.get();
        if (!(item && item.classes)) return;
        let objs = utils.deepCloneObj(item.classes);

        if (objs.virtual_unlocks || objs.virtual_unlocks === 0) {
            objs.unlocks = (objs.unlocks ? objs.unlocks : 0) + objs.virtual_unlocks;
            delete objs.virtual_unlocks;
        }

        if (objs.cover_pic) objs.cover_pic = utils.picReplaceUrl(objs.cover_pic, config.imageHost);
        data.push(objs);
    })

    res.property('total', classList.count);
    return res.sendOk(data);
}

async function trySignUp(options: { unionid: string;[propName: string]: any }) {
    let user = await UsersDao.getInstance().findByUnionId(options.unionid);
    if (user) return user;

    let create = await UsersDao.getInstance().createUser(options);
    if (!create) return null;
    return create;
}

//日常签到
export async function dailySign(req: Request, res: Response, next: NextFunction) {
    let user_id = req.jwtAccessToken ? req.jwtAccessToken.sub : null;
    if (!user_id) return res.sendErr('用户过期');
    let { userInfoKey, userInfoExpire } = config.redisCache;
    let user = await rediscache.getRedisCache(user_id, userInfoKey); // 检查redis缓存
    if (!user) {
        user = await UsersDao.getInstance().findByPrimary(user_id);
        rediscache.setRedisCache(user_id, user, userInfoExpire, userInfoKey); // redis缓存
    }
    if (!user) return res.sendErr('不存在的用户');
    let sign_date = user.sign_date;
    let signDay = utils.momentFmt(new Date(sign_date).getTime(), 'YYYY-MM-DD')
    let today = utils.momentFmt(Date.now(), 'YYYY-MM-DD')
    if (signDay == today) {
        return res.sendOk('今日已签到');
    } else {
        sign_date = today;
        let coin = user.coin;
        console.log('coin-----', coin)
        coin = coin + 2;
        let options = {
            sign_date,
            coin
        };
        await rediscache.delRedisCache(user_id, userInfoKey); // 需要更新记录时，先清除缓存
        let results = await UsersDao.getInstance().updateUserInfo(user_id, options);
        if (!results) return res.sendErr('签到失败');
        let data = {
            msg: "签到成功",
            coin: coin
        }
        return res.sendOk(data);
    }
}

//兑换
export async function exchangeGoods(req: Request, res: Response, next: NextFunction) {
    let user_id = req.jwtAccessToken ? req.jwtAccessToken.sub : null;
    if (!user_id) return res.sendErr('用户过期');
    let { userInfoKey, userInfoExpire } = config.redisCache;
    let user = await rediscache.getRedisCache(user_id, userInfoKey); // 检查redis缓存
    if (!user) {
        user = await UsersDao.getInstance().findByPrimary(user_id);
        rediscache.setRedisCache(user_id, user, userInfoExpire, userInfoKey); // redis缓存
    }
    if (!user) return res.sendErr('不存在的用户');
    let coin = user.coin;
    let goods  =await GoodsDao.getInstance().findByPrimary(1);
    console.log("goods------",goods)
    if(!goods) return res.sendErr("未找到商品");
    let {price,stock,state} = goods;
    if(state == 'deleted') return res.sendErr("兑换商品已被删除")
    if(stock<=0) return res.sendErr("兑换商品库存不足")
    // 
    console.log(coin)
    if (coin-price>=0 ) {
        coin = coin - price;
        stock= stock -1; 
        let options = {
            coin
        };
        await rediscache.delRedisCache(user_id, userInfoKey); // 需要更新记录时，先清除缓存
        let results = await UsersDao.getInstance().updateUserInfo(user_id, options);
        if (!results) return res.sendErr('兑换失败');
        let goodsOpt ={
            stock
        }
        let goodsRes = await GoodsDao.getInstance().updateGoodsInfo(1, goodsOpt);
        if (!goodsRes) return res.sendErr('商品兑换失败');
        return res.sendOk('兑换成功');
    } else {
        return res.sendErr('兑换币不足，请加油获取！');
    }



}