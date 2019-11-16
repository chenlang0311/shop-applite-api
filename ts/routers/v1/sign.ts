import { Router } from 'express';
import { routerHandler } from '../../lib/routerbase';
import { Swipers } from '../../controllers';
const r = Router();
const router = new routerHandler(r).handler;

router.get('/list', Swipers.findSwiperList);

export default r;