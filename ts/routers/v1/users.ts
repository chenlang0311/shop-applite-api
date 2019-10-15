import { Router } from 'express';
import { validate } from '../../lib/validator';
import { routerHandler } from '../../lib/routerbase';
import { checkLogin } from '../../lib/jwt';
import { Users } from '../../controllers';
const r = Router();
const router = new routerHandler(r).handler;

router.get('/weapp/login', validate, Users.weappLogin); // 微信登录
router.post('/weapp/sign', validate, Users.weappSign); // 注册登录 返回token
router.post('/setinfo', checkLogin, Users.setUserInfo); // 设置用户信息
router.get('/userinfo', checkLogin, Users.getUserInfo); // 获取用户信息
router.get('/classes', checkLogin, Users.findUserClassList); // 我的课程
router.post('/dailysign', checkLogin, Users.dailySign); // 日常签到
router.post('/exchange-goods', checkLogin, Users.exchangeGoods); // 兑换商品
export default r;