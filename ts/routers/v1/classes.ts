import { Router } from 'express';
import { validate } from '../../lib/validator';
import { routerHandler } from '../../lib/routerbase';
// import { checkLogin } from '../../lib/jwt';
import { Classes } from '../../controllers';
const r = Router();
const router = new routerHandler(r).handler;

router.get('/list', validate, Classes.findClassList); // 课程列表
router.get('/details/:id', Classes.findClassDetails); // 课程详情

export default r;