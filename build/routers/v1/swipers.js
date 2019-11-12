"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const routerbase_1 = require("../../lib/routerbase");
const controllers_1 = require("../../controllers");
const r = express_1.Router();
const router = new routerbase_1.routerHandler(r).handler;
router.get('/list', controllers_1.Swipers.findSwiperList);
exports.default = r;

//# sourceMappingURL=../../maps/routers/v1/swipers.js.map
