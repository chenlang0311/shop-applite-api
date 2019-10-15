"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function response(req, res, next) {
    let success = (data = {}, statusCode = 200) => {
        res.status(statusCode);
        let result = { status: true, data: data };
        if (res.extraProperty) {
            for (let key in res.extraProperty) {
                result[key] = res.extraProperty[key];
            }
        }
        res.json(result);
    };
    let fail = (e = new Error()) => {
        res.status(e instanceof ReqError ? e.getStatusCode() : 500);
        res.json({ status: false, msg: e.message, code: e instanceof ReqError ? e.getCode() : 1000 });
    };
    /**
     * 异常回复
     */
    res.sendError = (e = new Error()) => fail(e);
    res.sendErr = (msg = '') => fail(new ReqError(msg, 1100));
    res.sendErrMsg = (msg = '') => fail(new ReqError(msg, 1103));
    res.sendNotLogin = (msg = '未登录') => fail(new ReqError(msg, 1101));
    res.sendNotRole = (msg = '权限不足') => fail(new ReqError(msg, 1201));
    res.sendNotFound = (msg = '资源不存在') => fail(new ReqError(msg, 1104, 404));
    /**
     * 成功回复
     */
    res.sendOk = (data = {}, statusCode = 200) => success(data, statusCode);
    res.createdOk = (data = {}, statusCode = 201) => success(data, statusCode);
    res.deleteOK = (data = {}, statusCode = 204) => success(data, statusCode);
    res.property = (key, val) => {
        res.extraProperty = res.extraProperty || {};
        res.extraProperty[key] = val;
    };
    next();
}
exports.response = response;
class ReqError extends Error {
    constructor(msg, code = 1000, statusCode = 200) {
        super(msg);
        this.code = code;
        this.statusCode = statusCode;
    }
    getCode() {
        return this.code;
    }
    getStatusCode() {
        return this.statusCode;
    }
}
exports.ReqError = ReqError;

//# sourceMappingURL=../maps/lib/response.js.map
