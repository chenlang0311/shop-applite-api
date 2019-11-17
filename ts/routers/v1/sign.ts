import { Router } from 'express';
import { routerHandler } from '../../lib/routerbase';
import { Sign } from '../../controllers';
const r = Router();
const router = new routerHandler(r).handler;

router.get('/today', Sign.findSwiperList);
router.get('/list', Sign.findSwiperList);

export default r;