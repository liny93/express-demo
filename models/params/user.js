/**
 * 参数校检，两种写法
 * 1) keys: params,query,body对应req
 * 2) 默认 req.body
 * 
 * 数组接收四个值：
 * 1 参数名（必填）
 * 2 非空检查 （必填）
 * 3 检查函数 （必填）
 * 4 函数配置 （选填）
 */

const loginParam = {
    params: [],
    query: [],
    body: [
        ['username', true, 'isString', { lenminh: { min: 6, max: 10 } }],
        ['password', true, 'isString', { lenminh: { min: 6, max: 10 } }]
    ]
}

const registerParam = [
    ['username', true, 'isString', { lenminh: { min: 6, max: 10 } }],
    ['password', true, 'isString', { lenminh: { min: 6, max: 10 } }]
]

const updatePasswordParam = [
    ['oldPwd', true, 'isString', { lenminh: { min: 6, max: 10 } }],
    ['newPwd', true, 'isString', { lenminh: { min: 6, max: 10 } }]
]

module.exports = {
    loginParam,
    registerParam,
    updatePasswordParam
}