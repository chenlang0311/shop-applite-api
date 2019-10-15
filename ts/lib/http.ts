import * as http from 'http';
import * as https from 'https';
import * as logger from 'winston';

export class myHttpRequest {
    private protocol: string;
    private host: string;
    private port: number;
    private path: string;

    constructor(host: string, path: string, protocol: string = 'http', port?: number) {
        if (!port && protocol === 'http') port = 80;
        if (!port && protocol === 'https') port = 443;
        this.protocol = protocol;
        this.host = host;
        this.path = path;
        this.port = port;
    }

    private request(opts: https.RequestOptions, content?: string) {
        let self = this;
        return new Promise<any>(function (resolve, reject) {
            let request: http.ClientRequest,
                resTime: any,
                chunks: any[] = [],
                size: number = 0;

            function cb(res: http.IncomingMessage) {
                res.on('data', (chunk) => {
                    chunks.push(chunk);
                    size += chunk.length;
                }).on('end', () => {
                    let buf = Buffer.concat(chunks, size);
                    clearTimeout(resTime);
                    resolve(buf.toString());
                })
            }

            if (self.protocol === 'https') {
                request = https.request(opts, (res) => cb(res));
            } else {
                request = http.request(opts, (res) => cb(res));
            }

            request.on('socket', () => {
                resTime = setTimeout(() => { request.abort() }, 30000);
            });

            request.on('error', (e) => {
                logger.error(`myHttpRequest error : ${e}`);
                reject(e);
            });

            if (content) request.write(content);
            request.end();
        })
    }

    postxml(xml: string, opts?: any) {
        let options: any = {
            host: this.host,
            port: this.port,
            path: this.path,
            method: 'POST',
            headers: {
                'Content-Type': 'application/xml;charset=utf-8',
                'Content-Length': Buffer.byteLength(xml)
            }
        }
        if (opts) {
            for (let key in opts) {
                options[key] = opts[key];
            }
        }

        return this.request(options, xml);
    }

    post(obj: any) {
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
        }

        return this.request(options, jsonObject);
    }

    get(obj: any) {
        let str = '';
        if (obj) {
            let i = 0;
            for (let key in obj) {
                if (i == 0) {
                    str += `?${key}=${obj[key]}`;
                } else {
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
        }

        return this.request(options);
    }
}