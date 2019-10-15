import { config } from '../config/config';
const Capi = require('qcloudapi-sdk');

interface capiParams {
    SecretId: string;
    SecretKey: string;
    serviceType: string;
}

export class Qcapi {
    private static instance: Qcapi;
    private capi: any

    private constructor(params: capiParams) {
        this.capi = new Capi(params);
    }

    public static getInstance(conf?: capiParams) {
        let options = {
            SecretId: config.vod.secretId,
            SecretKey: config.vod.secretKey,
            serviceType: config.vod.serviceType
        }

        if (conf) options = conf;
        if (!Qcapi.instance) Qcapi.instance = new Qcapi(options);
        return Qcapi.instance;
    }

    public request(params: any) {
        let self = this;
        return new Promise<any>(function (resolve, reject) {
            self.capi.request(params, function (err: any, data: any) {
                if (err) return reject(err && err.stack ? err.stack : err);
                return resolve(data);
            });
        });
    }
}