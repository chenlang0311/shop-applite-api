import { Request, Response, NextFunction } from 'express';
import { SignDao, UsersDao } from '../dao';
import * as rediscache from '../lib/rediscache';
import * as utils from '../lib/utils';
import { config } from '../config/config';

export async function findSignList(req: Request, res: Response, next: NextFunction) {
    let { start_time, end_time} = req.query;
    if (!end_time) end_time = Date.now();
    let user_id = req.jwtAccessToken ? req.jwtAccessToken.sub : null;
    if (!user_id) return res.sendErr('用户过期');
    // return res.sendOk(date);
    let results = await SignDao.getInstance().findByDate(user_id);
    if (!results) return res.sendErr('暂无签到记录');
    let data = results.rows.map(r => {
        let item = r.get();
        let keyTime = new Date(item.created).getTime();
        if(keyTime>=start_time&&keyTime<=end_time){
            return item
        }
    })
    return res.sendOk(data);
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