import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';
import * as logger from 'winston';
import * as assert from 'assert';
import * as utils from './utils';
import { config } from '../config/config';

export function jwtEncode(user: any) {
    let { id, username, nickname } = user;
    assert(id);

    let sub = id.toString();
    let payload: any = { sub: sub }

    if (username) payload.username = username;
    if (nickname) payload.nickname = nickname;

    let token = jwt.sign(
        payload,
        Buffer.from(config.jwt.secret, 'base64'),
        { expiresIn: config.jwt.expiresIn }
    );

    return token;
}

export function jwtDecode(token: string) {
    if (!token) return undefined
    let decoded;
    try {
        decoded = jwt.verify(token, Buffer.from(config.jwt.secret, 'base64'));
    } catch (err) {
        logger.error(err.stack);
    }

    return decoded;
}

export function jwtVerify(req: Request, res: Response, next: NextFunction) {
    let token = req.query['token'];
    if (!token) return res.sendErr('无效的token');

    try {
        jwt.verify(token, Buffer.from(config.jwt.secret, 'base64'));
    } catch (err) {
        logger.error(err.stack);
        return res.sendErr('无效的token');
    }

    return next();
}

export function jwtMiddle(req: Request, res: Response, next: NextFunction) {
    let token;
    if (req.headers.authorization && utils.isString(req.headers.authorization) && (req.headers.authorization as string).split(' ')[0] === 'Bearer') {
        token = (req.headers.authorization as string).split(' ')[1];
    } else if (req.query && req.query.token) {
        token = req.query.token;
    } else if (req.body && req.body.token) {
        token = req.body.token;
    }

    if (token) {
        try {
            req.jwtAccessToken = jwt.verify(token, Buffer.from(config.jwt.secret, 'base64'));
        } catch (err) {
            req.jwtAccessToken = undefined;
        }
    } else {
        req.jwtAccessToken = undefined;
    }

    return next();
}

export function checkLogin(req: Request, res: Response, next: NextFunction) {
    if (!req.jwtAccessToken) return res.sendNotLogin('未登录');
    return next();
}