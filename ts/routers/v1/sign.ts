import { Router } from 'express';
import { routerHandler } from '../../lib/routerbase';
import { Sign } from '../../controllers';
const r = Router();
const router = new routerHandler(r).handler;

router.get('/today', Sign.findSignList);
router.get('/list', Sign.findSignList);

export default r;