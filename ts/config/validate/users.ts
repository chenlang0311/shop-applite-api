export const users: any = {
    '/weapp/login': {
        code: { notEmpty: true, errorMessage: '请求异常，参数缺失' }
    },
    '/weapp/sign': {
        rds_session_key: { notEmpty: true, errorMessage: '请求异常，参数缺失' }
    }
}