"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const fs = require("fs");
const express = require("express");
const compression = require("compression");
const bodyParser = require("body-parser");
require('body-parser-xml')(bodyParser);
const logger = require("winston");
const expressValidator = require("express-validator");
const requestIp = require("request-ip");
const schedule = require("./schedule");
const routers_1 = require("./routers");
const response_1 = require("./lib/response");
const dao_1 = require("./dao");
const validator_1 = require("./lib/validator");
const config_1 = require("./config/config");
const winston_1 = require("./config/winston");
const jwt_1 = require("./lib/jwt");
const app = express();
const isDev = process.env.NODE_ENV === 'development' ? true : false;
dao_1.initDao()();
// 日志
const logdir = path.join(path.resolve(__dirname, '..'), 'logs');
fs.existsSync(logdir) || fs.mkdirSync(logdir);
logger.configure(winston_1.config(logdir));
// 跨域
app.all('*', function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', 'HEAD,PUT,POST,GET,DELETE,OPTIONS,PATCH');
    res.header("Access-Control-Allow-Headers", "X-Requested-With,Content-Type,Authorization");
    next();
});
// 通用中间件
app.use(requestIp.mw({ attributeName: 'clientIP' })); // ip 地址
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// 微信xml通知
app.use('/api/v1/pays/wxpay/notify', bodyParser.xml({
    limit: '2MB',
    xmlParseOptions: { explicitArray: false, ignoreAttrs: true }
}));
app.use(compression()); // 压缩
if (isDev)
    app.use('/public', express.static(config_1.config.staticDir));
if (isDev)
    app.use('/', express.static(config_1.config.staticDir));
// 自定义中间件
app.use(expressValidator({ customValidators: validator_1.customValidators, errorFormatter: validator_1.errorFormatter }));
app.use(response_1.response);
app.use(jwt_1.jwtMiddle);
routers_1.routers(app); // 路由
// 错误处理
app.use(function (req, res, next) {
    let err = new response_1.ReqError('Not Found', 1004, 404);
    next(err);
});
app.use(function (err, req, res, next) {
    logger.error(req.protocol + '://' + req.get('host') + req.originalUrl, err.stack);
    let code = err instanceof response_1.ReqError ? err.getStatusCode() : 500;
    if (isDev)
        return res.status(code).send(err.stack).end();
    return res.status(code).end();
});
schedule.init();
process.on("uncaughtException", (err) => logger.error("uncaughtException", err.stack));
app.listen(config_1.config.port, () => logger.info(`service start sucess and listening on port ${config_1.config.port}...`));

//# sourceMappingURL=maps/app.js.map
