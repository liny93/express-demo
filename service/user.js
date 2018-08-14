require('dotenv').config();

const { db, models } = require('../models')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

class UserService {
    static getInstance() {
        if (!this.instance) {
            this.instance = new UserService()
        }
        return this.instance
    }

    // 登录检查
    async checkLogin(username, password) {
        const user = await models.user.findOne({ where: { username: username } }) // 查询用户

        if (!user || !bcrypt.compareSync(password, user.password)) return [400, 'invalid user']  // 无效用户

        await models.user.update({ last_login: new Date() }, { where: { username: username }, fields: ['last_login'] }) // 修改登录时间

        const token = jwt.sign({ id: user.id, role: user.role }, process.env.TOKEN_SECREKEY, { expiresIn: 60 * 10 }) // 生成jwt

        return [{ token }]
    }

    // 修改密码
    async updatePassword(id, oldPwd, newPwd) {
        const user = await models.user.findById(id)
        if (!bcrypt.compareSync(oldPwd, user.password)) return [400, 'invalid old password']

        await models.user.update({ password: bcrypt.hashSync(newPwd, bcrypt.genSaltSync(8)) }, { where: { id }, fields: ['password'] })
        return ['success']
    }

    // 注册
    async register(username, password) {
        const user = await models.user.findOne({ where: { username: username } }) // 查询用户

        if (user) return [400, "this user already exists"]

        const newUser = {
            username: username,
            password: bcrypt.hashSync(password, bcrypt.genSaltSync(8)),
            role: 'user',
            input_date: new Date(),
            last_login: new Date()
        }

        await models.user.create(newUser)

        return ['success']
    }

    // 获取用户信息
    async getUserInfo(id) {
        const user = await models.user.findById(id)
        return { username: user.username, role: user.role, last_login: user.last_login }
    }

    // 用户列表
    async getUserList() {
        const users = await models.user.findAll({ attributes: ['username'] })
        return users.map(v => v.username)
    }
}

module.exports = UserService.getInstance()