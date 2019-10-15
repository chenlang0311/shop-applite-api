"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const validator_1 = require("../../lib/validator");
const routerbase_1 = require("../../lib/routerbase");
const jwt_1 = require("../../lib/jwt");
const controllers_1 = require("../../controllers");
const r = express_1.Router();
const router = new routerbase_1.routerHandler(r).handler;
router.post('/wxpay', jwt_1.checkLogin, validator_1.validate, controllers_1.Pays.wxpay); // 微信支付
router.post('/wxpay/notify', controllers_1.Pays.wxNotify); // 微信回调
router.post('/order/notify', controllers_1.Pays.orderNotify); // 支付完成后，订单完成通知
exports.default = r;

//# sourceMappingURL=../../maps/routers/v1/pays.js.map
