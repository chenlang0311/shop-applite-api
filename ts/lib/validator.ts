import { Request, Response, NextFunction } from 'express';
import { validate as validateConfig } from '../config/validate';
import * as utils from './utils';

export async function validate(req: Request, res: Response, next: NextFunction) {
	let [baseurl, route] = [req.baseUrl, req.route.path];
	let schema = typeof validateConfig[baseurl] != 'undefined' ? validateConfig[baseurl][route] : null;

	if (schema) req.check(schema);

	let result = await req.getValidationResult();
	if (!result.isEmpty()) return res.sendErr(result.array()[0].msg);
	next();
}

export const customValidators = {
	myWhitelisted: (param: any, ...args: any[]) => args.indexOf(param) >= 0,
	myIsArray: (param: any) => Object.prototype.toString.call(param) === '[object Array]',
	myIsString: (param: any) => utils.isString(param),
	myIsStrOrNum: (param: any) => utils.isString(param) || utils.isNumber(param),
	myDate: (param: any) => {
		if (!param) return false;
		let result = param.match(/^(\d{1,4})-(\d{1,2})-(\d{1,2})$/);
		if (result == null) return false;
		let d = new Date(result[1], result[2] - 1, result[3]);
		return (d.getFullYear() == result[1] && (d.getMonth() + 1) == result[2] && d.getDate() == result[3]);
	},
	myDateTime: (param: any) => {
		if (!param) return false;
		let result = param.match(/^(\d{1,4})-(\d{1,2})-(\d{1,2}) (\d{1,2}):(\d{1,2}):(\d{1,2})$/);
		if (result == null) return false;
		let d = new Date(result[1], result[2] - 1, result[3], result[4], result[5], result[6]);
		return (d.getFullYear() == result[1] && (d.getMonth() + 1) == result[2] && d.getDate() == result[3] &&
			d.getHours() == result[4] && d.getMinutes() == result[5] && d.getSeconds() == result[6]);
	}
}

export function errorFormatter(param: any, msg: any, value: any) {
	let namespace: string[] = (param + '').split('.'),
		root: string = namespace.shift(),
		formParam: string = root;

	while (namespace.length) formParam += '[' + namespace.shift() + ']';

	return {
		param: formParam,
		msg: msg,
		value: value
	}
}