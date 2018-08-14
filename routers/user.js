const { user } = require('../controllers')
let { register, isLogin, checkPermission, checkParam } = require('../util')

const express = require('express')
const router = express.Router()

// 登录
register(router, 'post', '/login', user.login, checkParam('user', 'loginParam'))

// 注册
register(router, 'post', '/reg', user.register, checkParam('user', 'registerParam'))

// 获取用户信息，登录后可以查看
register(router, 'get', '/info', user.getUserInfo, isLogin)

// 修改密码，登录后可以修改
register(router, 'post', '/upwd', user.updatePassword, isLogin, checkParam('user', 'updatePasswordParam'))

// 获取角色列表，仅管理员可以
register(router, 'get', '/list', user.getUserList, checkPermission('admin'))

module.exports = router