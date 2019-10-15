"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const validator_1 = require("../../lib/validator");
const routerbase_1 = require("../../lib/routerbase");
const jwt_1 = require("../../lib/jwt");
const controllers_1 = require("../../controllers");
const r = express_1.Router();
const router = new routerbase_1.routerHandler(r).handler;
router.get('/weapp/login', validator_1.validate, controllers_1.Users.weappLogin); // 微信登录
router.post('/weapp/sign', validator_1.validate, controllers_1.Users.weappSign); // 注册登录 返回token
router.post('/setinfo', jwt_1.checkLogin, controllers_1.Users.setUserInfo); // 设置用户信息
router.get('/userinfo', jwt_1.checkLogin, controllers_1.Users.getUserInfo); // 获取用户信息
router.get('/classes', jwt_1.checkLogin, controllers_1.Users.findUserClassList); // 我的课程
router.post('/dailysign', jwt_1.checkLogin, controllers_1.Users.dailySign); // 日常签到
router.post('/exchange-goods', jwt_1.checkLogin, controllers_1.Users.exchangeGoods); // 兑换商品
exports.default = r;

//# sourceMappingURL=../../maps/routers/v1/users.js.map
