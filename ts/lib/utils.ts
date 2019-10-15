import * as crypto from 'crypto';
import * as moment from 'moment';
import * as fs from 'fs';
import * as path from 'path';
import * as xml2js from 'xml2js';

export function isObject(obj: any) {
    return Object.prototype.toString.call(obj) === '[object Object]';
}

export function isArray(arr: any) {
    return Object.prototype.toString.call(arr) === '[object Array]';
}

export function isString(str: any) {
    return Object.prototype.toString.call(str) === '[object String]';
}

export function isNumber(num: any) {
    return Object.prototype.toString.call(num) === '[object Number]';
}

export function isFunction(func: any) {
    return Object.prototype.toString.call(func) === '[object Function]';
}

export function isRealNumber(val: any) {
    if (val === "" || val == null || val == undefined) return false;
    if (isNaN(val)) return false;
    return true;
}

export function inArray(key: string, arr: string[]) {
    return arr.some(val => val === key);
}

export function trim(str: string) {
    return str.replace(/(^\s*)|(\s*$)/g, "");
}

export function strCut(str: string, len: number, tail: boolean = true) {
    let strLen = str.length;
    if (strLen < len) return str;

    let newStr = str.substring(0, len);
    if (tail) return `${newStr}...`;
    return newStr;
}

export function firstUpperCase(str: string) {
    return str.toLowerCase().replace(/\b(\w)|\s(\w)/g, (L) => L.toUpperCase());
}

export function randomString(size: number = 10) {
    let [text, chars] = ['', 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'];
    for (var i = 0; i < size; i++) text += chars.charAt(Math.floor(Math.random() * chars.length));

    return text;
}

export function randomInt(from: number, to: number) {
    return Math.floor(Math.random() * (to - from + 1) + from)
}

export function prefixInteger(num: number | string, length: number) {
    return (Array(length).join('0') + num).slice(-length);
}

export function md5sum(str: string): string {
    return crypto.createHash('md5').update(str).digest('hex');
}

export function sha1(str: string) {
    return crypto.createHash('sha1').update(str).digest('hex');
}

export function base64Decode(str: string) {
    return Buffer.from(str, 'base64').toString();
}

export function encrypt(str: string, secret: string) {
    let cipher = crypto.createCipher('aes192', secret);
    let enc = cipher.update(str, 'utf8', 'hex');
    enc += cipher.final('hex');
    return enc;
}

export function decrypt(str: string, secret: string) {
    let decipher = crypto.createDecipher('aes192', secret);
    let dec = decipher.update(str, 'hex', 'utf8');
    dec += decipher.final('utf8');
    return dec;
}

// 浅克隆
export function cloneObj(obj: any, arr?: string[]) {
    let data: any = {};
    if (arr) {
        arr.forEach(element => data[element] = obj[element]);
    } else {
        for (let key in obj) {
            if (obj.hasOwnProperty(key))
                data[key] = obj[key];
        }
    }

    return data;
}

// 深克隆
export function deepCloneObj(obj: any) {
    let str, newobj = obj.constructor === Array ? [] : {};
    if (typeof obj !== 'object') return obj;

    str = JSON.stringify(obj);
    newobj = JSON.parse(str);

    return newobj;
}

export function getPageCount(page: string = '1', count: string = '10') {
    let limit = parseInt(count);
    limit = limit > 1 ? limit : 1;

    let offset = (parseInt(page) - 1) * limit;
    offset = offset > 0 ? offset : 0;

    return { offset, limit }
}

export function momentFmt(date: any, fmt: string = 'YYYY-MM-DD HH:mm:ss') {
    let result: any;
    if (isArray(date)) {
        result = [];
        (date as any[]).forEach(e => result.push(moment(e).format(fmt)));
    } else {
        result = moment(date).format(fmt);
    }

    return result;
}

export function momentDiff(date1: string, date2: string, cal: number = 1000 * 60 * 60 * 24) {
    return Math.floor(moment(date2).diff(moment(date1)) / cal);
}

export function momentIsSameHour(time1: number, time2: number) {
    if (time1.toString().length === 10) time1 = time1 * 1000;
    if (time2.toString().length === 10) time2 = time2 * 1000;
    return moment(time1).format('YYYYMMDDHH') === moment(time2).format('YYYYMMDDHH');
}

export function momentGet(fmt: string = 'YYYY-MM-DD HH:mm:ss') {
    return moment().format(fmt);
}

export function existsSync(path: string) {
    if (fs.existsSync(path)) {
        return true;
    }
    return false;
}

export function mkdirsSync(dirname: string) {
    if (fs.existsSync(dirname)) {
        return true;
    } else {
        if (mkdirsSync(path.dirname(dirname))) {
            fs.mkdirSync(dirname);
            return true;
        }
    }

    return true;
}

export function myCompare(prop: string) {
    return function (obj1: any, obj2: any) {
        let val1 = obj1[prop];
        let val2 = obj2[prop];
        if (!isNaN(Number(val1)) && !isNaN(Number(val2))) {
            val1 = Number(val1);
            val2 = Number(val2);
        }
        if (val1 < val2) {
            return -1;
        } else if (val1 > val2) {
            return 1;
        } else {
            return 0;
        }
    }
}

export function ObjToStringDictSort(obj: any, filter: boolean = false) {
    if (!isObject(obj)) return obj;

    let keys = Object.keys(obj);
    keys.sort();

    let keysMap: any[] = [];
    keys.forEach((value, index) => {
        if (obj[value] === '') return; // 微信，为空的字符串需要过滤掉，否则会出问题

        if (filter) {
            if (obj[value] || obj[value] === 0) keysMap.push(`${value}=${obj[value]}`);
        } else {
            keysMap.push(`${value}=${obj[value]}`);
        }
    })

    let keysStr = keysMap.join('&');

    return keysStr;
}

export function obj2Xml(obj: any, xmlOptsV2: xml2js.OptionsV2 = { rootName: 'xml', cdata: true, headless: true }) {
    if (!(isObject(obj))) return obj;

    let xmlBuilder = new xml2js.Builder(xmlOptsV2);
    let xml = xmlBuilder.buildObject(obj);

    return xml;
}

export function xml2Obj(xml: string, xmlOptsV2: xml2js.OptionsV2 = { explicitArray: false, ignoreAttrs: true }) {
    let xmlParser = new xml2js.Parser(xmlOptsV2);
    return new Promise<any>((resolve, reject) => {
        xmlParser.parseString(xml, (err: any, results: any) => {
            if (err) reject(err)
            return resolve(results);
        });
    })
}

export function picReplaceUrl(url: string, hostPath: string) {
    if (url.indexOf('http') === 0) return url;
    return `${hostPath}${url}`
}