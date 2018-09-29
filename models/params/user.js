/**
 * 参数校检，两种写法
 * 1) keys: params,query,body对应req
 * 2) 默认 req.body
 * 
 *  : 转换前端发送的参数，这样在后端统一调用，如果前端参数名称变换，只需在此配置中修改即可，不影响后续程序的使用
 * 
 * model:
 * {
 *      frontName: "string" 前端发过来的参数名称                 必须有
 *      backName: "string"  将前端发过来的参数转换成指定名称      必须有
 *      noEmpty: boolean 非空判断                               默认可以为空
 *      fun: "string" 校检函数                                  必须有，且在预设的函数范围内
 *      default: "string" 默认值，如果参数为空，使用该默认值
 *      options?: object 校检函数参数
 * }
 */

const loginParam = {
    body: [
        {
            frontName: "username",
            backName: "username",
            noEmpty: true,
            fun: "isString",
            options: { length: { min: 3, max: 10 } }
        },
        {
            frontName: "password",
            backName: "password",
            noEmpty: true,
            fun: "isString",
            options: { length: { min: 3, max: 10 } }
        }
    ]
}

const registerParam = [
    {
        frontName: "username",
        backName: "username",
        noEmpty: true,
        fun: "isString",
        options: { length: { min: 3, max: 10 } }
    },
    {
        frontName: "password",
        backName: "password",
        noEmpty: true,
        fun: "isString",
        options: { length: { min: 3, max: 10 } }
    }
]

const updatePasswordParam = [
    {
        frontName: "oldPwddddddd",
        backName: "old",
        noEmpty: true,
        fun: "isString",
        options: { length: { min: 3, max: 10 } }
    },
    {
        frontName: "newPwd",
        backName: "newPwd",
        noEmpty: true,
        fun: "isString",
        options: { length: { min: 3, max: 10 } }
    }
]

const updateUserInfo = [
    {
        frontName: "id",
        backName: "id",
        noEmpty: true,
        fun: "isInt",
    },
    {
        frontName: "username",
        backName: "username",
        noEmpty: false,
        fun: "isString",
        options: { length: { min: 3, max: 10 } }
    },
    {
        frontName: "password",
        backName: "password",
        noEmpty: false,
        fun: "isString",
        options: { length: { min: 3, max: 10 } }
    },
    {
        frontName: "role",
        backName: "role",
        noEmpty: true,
        fun: "isIn",
        options: ['admin', 'user']
    }
]

module.exports = {
    loginParam,
    registerParam,
    updatePasswordParam,
    updateUserInfo
}