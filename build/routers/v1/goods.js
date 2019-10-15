"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const routerbase_1 = require("../../lib/routerbase");
// import { checkLogin } from '../../lib/jwt';
const controllers_1 = require("../../controllers");
const r = express_1.Router();
const router = new routerbase_1.routerHandler(r).handler;
router.get('/list', controllers_1.Goods.findClassList); // 课程列表
router.get('/details/:id', controllers_1.Goods.findClassDetails); // 课程详情
exports.default = r;

//# sourceMappingURL=../../maps/routers/v1/goods.js.map
