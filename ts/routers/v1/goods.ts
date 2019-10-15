import { Router } from 'express';
import { routerHandler } from '../../lib/routerbase';
// import { checkLogin } from '../../lib/jwt';
import { Goods } from '../../controllers';
const r = Router();
const router = new routerHandler(r).handler;

router.get('/list', Goods.findClassList); // 课程列表
router.get('/details/:id', Goods.findClassDetails); // 课程详情

export default r;