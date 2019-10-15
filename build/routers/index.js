"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const users_1 = require("./v1/users");
const classes_1 = require("./v1/classes");
const catalogs_1 = require("./v1/catalogs");
// import vodsRouterV1 from './v1/vods';
const pays_1 = require("./v1/pays");
const swipers_1 = require("./v1/swipers");
const goods_1 = require("./v1/goods");
function routers(app) {
    app.use('/api/v1/users', users_1.default);
    app.use('/api/v1/classes', classes_1.default);
    app.use('/api/v1/catalogs', catalogs_1.default);
    // app.use('/api/v1/vod', vodsRouterV1);
    app.use('/api/v1/pays', pays_1.default);
    app.use('/api/v1/swipers', swipers_1.default);
    app.use('/api/v1/goods', goods_1.default);
}
exports.routers = routers;

//# sourceMappingURL=../maps/routers/index.js.map
