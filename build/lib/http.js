"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const http = require("http");
const https = require("https");
const logger = require("winston");
class myHttpRequest {
    constructor(host, path, protocol = 'http', port) {
        if (!port && protocol === 'http')
            port = 80;
        if (!port && protocol === 'https')
            port = 443;
        this.protocol = protocol;
        this.host = host;
        this.path = path;
        this.port = port;
    }
    request(opts, content) {
        let self = this;
        return new Promise(function (resolve, reject) {
            let request, resTime, chunks = [], size = 0;
            function cb(res) {
                res.on('data', (chunk) => {
                    chunks.push(chunk);
                    size += chunk.length;
                }).on('end', () => {
                    let buf = Buffer.concat(chunks, size);
                    clearTimeout(resTime);
                    resolve(buf.toString());
                });
            }
            if (self.protocol === 'https') {
                request = https.request(opts, (res) => cb(res));
            }
            else {
                request = http.request(opts, (res) => cb(res));
            }
            request.on('socket', () => {
                resTime = setTimeout(() => { request.abort(); }, 30000);
            });
            request.on('error', (e) => {
                logger.error(`myHttpRequest error : ${e}`);
                reject(e);
            });
            if (content)
                request.write(content);
            request.end();
        });
    }
    postxml(xml, opts) {
        let options = {
            host: this.host,
            port: this.port,
            path: this.path,
            method: 'POST',
            headers: {
                'Content-Type': 'application/xml;charset=utf-8',
                'Content-Length': Buffer.byteLength(xml)
            }
        };
        if (opts) {
            for (let key in opts) {
                options[key] = opts[key];
            }
        }
        return this.request(options, xml);
    }
    post(obj) {
        let jsonObject = JSON.stringify(obj);
        let options = {
            host: this.host,
            port: this.port,
            path: this.path,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(jsonObject, 'utf8')
            }
        };
        return this.request(options, jsonObject);
    }
    get(obj) {
        let str = '';
        if (obj) {
            let i = 0;
            for (let key in obj) {
                if (i == 0) {
                    str += `?${key}=${obj[key]}`;
                }
                else {
                    str += `&${key}=${obj[key]}`;
                }
                i++;
            }
        }
        let options = {
            host: this.host,
            port: this.port,
            path: this.path + str,
            method: 'GET'
        };
        return this.request(options);
    }
}
exports.myHttpRequest = myHttpRequest;

//# sourceMappingURL=../maps/lib/http.js.map
