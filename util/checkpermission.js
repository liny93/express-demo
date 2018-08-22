require('dotenv').config();

const resJson = require('./resJson')
const jwt = require('jsonwebtoken')

// 登录检查
exports.isLogin = (req, res, next) => {
    const token = req.headers['authorization']
    if (!token) return resJson(res, 403, '')

    try {
        let userinfo = jwt.verify(token, process.env.TOKEN_SECREKEY)
        req.userid = userinfo.id
        next()
    } catch (err) {
        return resJson(res, 403, '')
    }
}

/**
 * 权限检查
 * 从jwt中取出当前访问用户的role，然后与该router所需role进行比较
 * @param {String} role 当前router所需角色
 */
exports.checkPermission = (role) => {
    return (req, res, next) => {
        const token = req.headers['authorization']
        if (!token) return resJson(res, 403, '')

        try {
            let userinfo = jwt.verify(token, process.env.TOKEN_SECREKEY)
            if (userinfo.role !== role) return resJson(res, 403, 'You don\'t have permission to access')

            req.userid = userinfo.id
            next()
        } catch (err) {
            return resJson(res, 403, '')
        }
    }
}