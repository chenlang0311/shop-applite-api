"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const crypto = require("crypto");
const moment = require("moment");
const fs = require("fs");
const path = require("path");
const xml2js = require("xml2js");
function isObject(obj) {
    return Object.prototype.toString.call(obj) === '[object Object]';
}
exports.isObject = isObject;
function isArray(arr) {
    return Object.prototype.toString.call(arr) === '[object Array]';
}
exports.isArray = isArray;
function isString(str) {
    return Object.prototype.toString.call(str) === '[object String]';
}
exports.isString = isString;
function isNumber(num) {
    return Object.prototype.toString.call(num) === '[object Number]';
}
exports.isNumber = isNumber;
function isFunction(func) {
    return Object.prototype.toString.call(func) === '[object Function]';
}
exports.isFunction = isFunction;
function isRealNumber(val) {
    if (val === "" || val == null || val == undefined)
        return false;
    if (isNaN(val))
        return false;
    return true;
}
exports.isRealNumber = isRealNumber;
function inArray(key, arr) {
    return arr.some(val => val === key);
}
exports.inArray = inArray;
function trim(str) {
    return str.replace(/(^\s*)|(\s*$)/g, "");
}
exports.trim = trim;
function strCut(str, len, tail = true) {
    let strLen = str.length;
    if (strLen < len)
        return str;
    let newStr = str.substring(0, len);
    if (tail)
        return `${newStr}...`;
    return newStr;
}
exports.strCut = strCut;
function firstUpperCase(str) {
    return str.toLowerCase().replace(/\b(\w)|\s(\w)/g, (L) => L.toUpperCase());
}
exports.firstUpperCase = firstUpperCase;
function randomString(size = 10) {
    let [text, chars] = ['', 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'];
    for (var i = 0; i < size; i++)
        text += chars.charAt(Math.floor(Math.random() * chars.length));
    return text;
}
exports.randomString = randomString;
function randomInt(from, to) {
    return Math.floor(Math.random() * (to - from + 1) + from);
}
exports.randomInt = randomInt;
function prefixInteger(num, length) {
    return (Array(length).join('0') + num).slice(-length);
}
exports.prefixInteger = prefixInteger;
function md5sum(str) {
    return crypto.createHash('md5').update(str).digest('hex');
}
exports.md5sum = md5sum;
function sha1(str) {
    return crypto.createHash('sha1').update(str).digest('hex');
}
exports.sha1 = sha1;
function base64Decode(str) {
    return Buffer.from(str, 'base64').toString();
}
exports.base64Decode = base64Decode;
function encrypt(str, secret) {
    let cipher = crypto.createCipher('aes192', secret);
    let enc = cipher.update(str, 'utf8', 'hex');
    enc += cipher.final('hex');
    return enc;
}
exports.encrypt = encrypt;
function decrypt(str, secret) {
    let decipher = crypto.createDecipher('aes192', secret);
    let dec = decipher.update(str, 'hex', 'utf8');
    dec += decipher.final('utf8');
    return dec;
}
exports.decrypt = decrypt;
// 浅克隆
function cloneObj(obj, arr) {
    let data = {};
    if (arr) {
        arr.forEach(element => data[element] = obj[element]);
    }
    else {
        for (let key in obj) {
            if (obj.hasOwnProperty(key))
                data[key] = obj[key];
        }
    }
    return data;
}
exports.cloneObj = cloneObj;
// 深克隆
function deepCloneObj(obj) {
    let str, newobj = obj.constructor === Array ? [] : {};
    if (typeof obj !== 'object')
        return obj;
    str = JSON.stringify(obj);
    newobj = JSON.parse(str);
    return newobj;
}
exports.deepCloneObj = deepCloneObj;
function getPageCount(page = '1', count = '10') {
    let limit = parseInt(count);
    limit = limit > 1 ? limit : 1;
    let offset = (parseInt(page) - 1) * limit;
    offset = offset > 0 ? offset : 0;
    return { offset, limit };
}
exports.getPageCount = getPageCount;
function momentFmt(date, fmt = 'YYYY-MM-DD HH:mm:ss') {
    let result;
    if (isArray(date)) {
        result = [];
        date.forEach(e => result.push(moment(e).format(fmt)));
    }
    else {
        result = moment(date).format(fmt);
    }
    return result;
}
exports.momentFmt = momentFmt;
function momentDiff(date1, date2, cal = 1000 * 60 * 60 * 24) {
    return Math.floor(moment(date2).diff(moment(date1)) / cal);
}
exports.momentDiff = momentDiff;
function momentIsSameHour(time1, time2) {
    if (time1.toString().length === 10)
        time1 = time1 * 1000;
    if (time2.toString().length === 10)
        time2 = time2 * 1000;
    return moment(time1).format('YYYYMMDDHH') === moment(time2).format('YYYYMMDDHH');
}
exports.momentIsSameHour = momentIsSameHour;
function momentGet(fmt = 'YYYY-MM-DD HH:mm:ss') {
    return moment().format(fmt);
}
exports.momentGet = momentGet;
function existsSync(path) {
    if (fs.existsSync(path)) {
        return true;
    }
    return false;
}
exports.existsSync = existsSync;
function mkdirsSync(dirname) {
    if (fs.existsSync(dirname)) {
        return true;
    }
    else {
        if (mkdirsSync(path.dirname(dirname))) {
            fs.mkdirSync(dirname);
            return true;
        }
    }
    return true;
}
exports.mkdirsSync = mkdirsSync;
function myCompare(prop) {
    return function (obj1, obj2) {
        let val1 = obj1[prop];
        let val2 = obj2[prop];
        if (!isNaN(Number(val1)) && !isNaN(Number(val2))) {
            val1 = Number(val1);
            val2 = Number(val2);
        }
        if (val1 < val2) {
            return -1;
        }
        else if (val1 > val2) {
            return 1;
        }
        else {
            return 0;
        }
    };
}
exports.myCompare = myCompare;
function ObjToStringDictSort(obj, filter = false) {
    if (!isObject(obj))
        return obj;
    let keys = Object.keys(obj);
    keys.sort();
    let keysMap = [];
    keys.forEach((value, index) => {
        if (obj[value] === '')
            return; // 微信，为空的字符串需要过滤掉，否则会出问题
        if (filter) {
            if (obj[value] || obj[value] === 0)
                keysMap.push(`${value}=${obj[value]}`);
        }
        else {
            keysMap.push(`${value}=${obj[value]}`);
        }
    });
    let keysStr = keysMap.join('&');
    return keysStr;
}
exports.ObjToStringDictSort = ObjToStringDictSort;
function obj2Xml(obj, xmlOptsV2 = { rootName: 'xml', cdata: true, headless: true }) {
    if (!(isObject(obj)))
        return obj;
    let xmlBuilder = new xml2js.Builder(xmlOptsV2);
    let xml = xmlBuilder.buildObject(obj);
    return xml;
}
exports.obj2Xml = obj2Xml;
function xml2Obj(xml, xmlOptsV2 = { explicitArray: false, ignoreAttrs: true }) {
    let xmlParser = new xml2js.Parser(xmlOptsV2);
    return new Promise((resolve, reject) => {
        xmlParser.parseString(xml, (err, results) => {
            if (err)
                reject(err);
            return resolve(results);
        });
    });
}
exports.xml2Obj = xml2Obj;
function picReplaceUrl(url, hostPath) {
    if (url.indexOf('http') === 0)
        return url;
    return `${hostPath}${url}`;
}
exports.picReplaceUrl = picReplaceUrl;

//# sourceMappingURL=../maps/lib/utils.js.map
