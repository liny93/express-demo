
const { UserService } = require('../service')
const { resJson } = require('../util')

// 登录
exports.login = async (req, res) => {
    const { username, password } = req.body
    const result = await UserService.checkLogin(username, password)
    return resJson(res, ...result)
}

// 注册
exports.register = async (req, res) => {
    const { username, password } = req.body
    const result = await UserService.register(username, password)
    return resJson(res, ...result)
}

// 获取用户信息
exports.getUserInfo = async (req, res) => {
    const id = req.userid
    const result = await UserService.getUserInfo(id)
    return resJson(res, result)
}

// 获取角色列表
exports.getUserList = async (req, res) => {
    const result = await UserService.getUserList()
    return resJson(res, result)
}

// 修改密码
exports.updatePassword = async (req, res) => {
    const { oldPwd, newPwd } = req.body
    const id = req.userid
    const result = await UserService.updatePassword(id, oldPwd, newPwd)
    return resJson(res, ...result)
}


exports.updateUserInfo = async (req, res) => {
    const user = req.body
    const result = await UserService.updateUserInfo(user)
    return resJson(res, ...result)
}
