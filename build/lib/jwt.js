"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jwt = require("jsonwebtoken");
const logger = require("winston");
const assert = require("assert");
const utils = require("./utils");
const config_1 = require("../config/config");
function jwtEncode(user) {
    let { id, username, nickname } = user;
    assert(id);
    let sub = id.toString();
    let payload = { sub: sub };
    if (username)
        payload.username = username;
    if (nickname)
        payload.nickname = nickname;
    let token = jwt.sign(payload, Buffer.from(config_1.config.jwt.secret, 'base64'), { expiresIn: config_1.config.jwt.expiresIn });
    return token;
}
exports.jwtEncode = jwtEncode;
function jwtDecode(token) {
    if (!token)
        return undefined;
    let decoded;
    try {
        decoded = jwt.verify(token, Buffer.from(config_1.config.jwt.secret, 'base64'));
    }
    catch (err) {
        logger.error(err.stack);
    }
    return decoded;
}
exports.jwtDecode = jwtDecode;
function jwtVerify(req, res, next) {
    let token = req.query['token'];
    if (!token)
        return res.sendErr('无效的token');
    try {
        jwt.verify(token, Buffer.from(config_1.config.jwt.secret, 'base64'));
    }
    catch (err) {
        logger.error(err.stack);
        return res.sendErr('无效的token');
    }
    return next();
}
exports.jwtVerify = jwtVerify;
function jwtMiddle(req, res, next) {
    let token;
    if (req.headers.authorization && utils.isString(req.headers.authorization) && req.headers.authorization.split(' ')[0] === 'Bearer') {
        token = req.headers.authorization.split(' ')[1];
    }
    else if (req.query && req.query.token) {
        token = req.query.token;
    }
    else if (req.body && req.body.token) {
        token = req.body.token;
    }
    if (token) {
        try {
            req.jwtAccessToken = jwt.verify(token, Buffer.from(config_1.config.jwt.secret, 'base64'));
        }
        catch (err) {
            req.jwtAccessToken = undefined;
        }
    }
    else {
        req.jwtAccessToken = undefined;
    }
    return next();
}
exports.jwtMiddle = jwtMiddle;
function checkLogin(req, res, next) {
    if (!req.jwtAccessToken)
        return res.sendNotLogin('未登录');
    return next();
}
exports.checkLogin = checkLogin;

//# sourceMappingURL=../maps/lib/jwt.js.map
