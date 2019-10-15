import { Router } from 'express';
import { validate } from '../../lib/validator';
import { routerHandler } from '../../lib/routerbase';
import { checkLogin } from '../../lib/jwt';
import { Pays } from '../../controllers';
const r = Router();
const router = new routerHandler(r).handler;

router.post('/wxpay', checkLogin, validate, Pays.wxpay); // 微信支付
router.post('/wxpay/notify', Pays.wxNotify); // 微信回调
router.post('/order/notify', Pays.orderNotify); // 支付完成后，订单完成通知

export default r;