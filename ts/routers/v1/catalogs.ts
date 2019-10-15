import { Router } from 'express';
import { routerHandler } from '../../lib/routerbase';
import { Catalogs } from '../../controllers';
const r = Router();
const router = new routerHandler(r).handler;

router.get('/details/:id', Catalogs.findCatalogDetails);
router.get('/count/:id', Catalogs.updateCatalogCount);

export default r;