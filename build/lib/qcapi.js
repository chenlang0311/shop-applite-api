"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("../config/config");
const Capi = require('qcloudapi-sdk');
class Qcapi {
    constructor(params) {
        this.capi = new Capi(params);
    }
    static getInstance(conf) {
        let options = {
            SecretId: config_1.config.vod.secretId,
            SecretKey: config_1.config.vod.secretKey,
            serviceType: config_1.config.vod.serviceType
        };
        if (conf)
            options = conf;
        if (!Qcapi.instance)
            Qcapi.instance = new Qcapi(options);
        return Qcapi.instance;
    }
    request(params) {
        let self = this;
        return new Promise(function (resolve, reject) {
            self.capi.request(params, function (err, data) {
                if (err)
                    return reject(err && err.stack ? err.stack : err);
                return resolve(data);
            });
        });
    }
}
exports.Qcapi = Qcapi;

//# sourceMappingURL=../maps/lib/qcapi.js.map
