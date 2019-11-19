import { Router } from 'express';
import { routerHandler } from '../../lib/routerbase';
// import { checkLogin } from '../../lib/jwt';
import { Goods } from '../../controllers';
const r = Router();
const router = new routerHandler(r).handler;


router.get('/exchange', Goods.exchangeGoods); // 兑换商品
router.get('/list', Goods.findGoodsList); // 课程列表
router.get('/details/:id', Goods.findGoodsDetail); // 课程详情

export default r;