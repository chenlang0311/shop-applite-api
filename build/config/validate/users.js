"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.users = {
    '/weapp/login': {
        code: { notEmpty: true, errorMessage: '请求异常，参数缺失' }
    },
    '/weapp/sign': {
        rds_session_key: { notEmpty: true, errorMessage: '请求异常，参数缺失' }
    }
};

//# sourceMappingURL=../../maps/config/validate/users.js.map
