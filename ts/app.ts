import * as path from 'path';
import * as fs from 'fs';
import * as express from 'express';
import * as compression from 'compression';
import * as bodyParser from 'body-parser';
require('body-parser-xml')(bodyParser);
import * as logger from 'winston';
import * as expressValidator from 'express-validator';
import * as requestIp from 'request-ip';
import * as schedule from './schedule';
import { routers } from './routers';
import { response, ReqError } from './lib/response';
import { initDao } from './dao';
import { customValidators, errorFormatter } from './lib/validator';
import { config as config } from './config/config';
import { config as logConfig } from './config/winston';
import { jwtMiddle } from './lib/jwt';

const app = express();
const isDev = process.env.NODE_ENV === 'development' ? true : false;

initDao()();

// 日志
const logdir = path.join(path.resolve(__dirname, '..'), 'logs');
fs.existsSync(logdir) || fs.mkdirSync(logdir);
logger.configure(logConfig(logdir));

// 跨域
app.all('*', function (req: any, res: any, next: any) {
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
app.use('/api/v1/pays/wxpay/notify', (bodyParser as any).xml({
    limit: '2MB',
    xmlParseOptions: { explicitArray: false, ignoreAttrs: true }
}))
app.use(compression()); // 压缩

if (isDev) app.use('/public', express.static(config.staticDir));
if (isDev) app.use('/', express.static(config.staticDir));

// 自定义中间件
app.use(expressValidator({ customValidators: customValidators, errorFormatter: errorFormatter }));
app.use(response);
app.use(jwtMiddle);

routers(app); // 路由

// 错误处理
app.use(function (req: express.Request, res: express.Response, next: express.NextFunction) {
    let err = new ReqError('Not Found', 1004, 404);
    next(err);
});

app.use(function (err: Error, req: express.Request, res: express.Response, next: express.NextFunction) {
    logger.error(req.protocol + '://' + req.get('host') + req.originalUrl, err.stack);
    let code = err instanceof ReqError ? err.getStatusCode() : 500;
    if (isDev) return res.status(code).send(err.stack).end();
    return res.status(code).end();
});

schedule.init();

process.on("uncaughtException", (err: Error) => logger.error("uncaughtException", err.stack));

app.listen(config.port, () => logger.info(`service start sucess and listening on port ${config.port}...`));