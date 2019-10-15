declare namespace Express {
    interface Request {
        jwtAccessToken: any;
        jwtExpireToken: any;
        clientIP: string;
    }

    interface Response {
        sendError: errFunction;
        sendErr: msgFunction;
        sendErrMsg: msgFunction;
        sendNotLogin: msgFunction;
        sendNotRole: msgFunction;
        sendNotFound: msgFunction;
        sendOk: okFunction;
        createdOk: okFunction;
        deleteOK: okFunction;
        property: ppFunction;
        extraProperty: any;
    }

    interface okFunction { (data?: any, statusCode?: number): any }

    interface msgFunction { (msg?: any): any }

    interface errFunction { (e?: Error): any }

    interface ppFunction { (key: string, val: any): any }
}