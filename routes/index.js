const express = require('express')
const controllers = require('../controllers')
const resJson = require('../util/resJson')
const router = express.Router()

const isLoggedIn = (req, res, next) => {
    if (req.session.authenticated) {
        return next()
    }
    return resJson(res, 403, '')
}

function register(method, args, userMiddleware) {
    let wrap = async (req, res, next) => {
        try {
            await userMiddleware(req, res, next)
        } catch (e) {
            console.log(`${new Date().toLocaleString()} --- ${e} --- ${args}\n`)
            return resJson(res, 400, 'Invalid param')
        }
    }
    router[method](args, wrap)
}

register('get', '/getUserInfo', controllers.test.getUserInfo)

module.exports = router 