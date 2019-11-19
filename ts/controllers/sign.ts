import { Request, Response, NextFunction } from 'express';
import { SignDao, UsersDao } from '../dao';
import * as rediscache from '../lib/rediscache';
import * as utils from '../lib/utils';
import { config } from '../config/config';

export async function findSignList(req: Request, res: Response, next: NextFunction) {
    let { date } = req.query;
    if (!date) date = Date.now();
    let opts = {
        limit: 10,
        where: {
            state: 'normal',
            date: date
        },
        order: [['level', 'desc']]
    }
    let results = await SignDao.getInstance().findSignList(opts);
    if (!results) return res.sendErr('获取签到记录异常');
    return res.sendOk(results);
}


export async function today(req: Request, res: Response, next: NextFunction) {
    
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