"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const routerbase_1 = require("../../lib/routerbase");
const controllers_1 = require("../../controllers");
const r = express_1.Router();
const router = new routerbase_1.routerHandler(r).handler;
router.get('/details/:id', controllers_1.Catalogs.findCatalogDetails);
router.get('/count/:id', controllers_1.Catalogs.updateCatalogCount);
exports.default = r;

//# sourceMappingURL=../../maps/routers/v1/catalogs.js.map
