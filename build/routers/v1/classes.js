"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const validator_1 = require("../../lib/validator");
const routerbase_1 = require("../../lib/routerbase");
// import { checkLogin } from '../../lib/jwt';
const controllers_1 = require("../../controllers");
const r = express_1.Router();
const router = new routerbase_1.routerHandler(r).handler;
router.get('/list', validator_1.validate, controllers_1.Classes.findClassList); // 课程列表
router.get('/details/:id', controllers_1.Classes.findClassDetails); // 课程详情
exports.default = r;

//# sourceMappingURL=../../maps/routers/v1/classes.js.map
