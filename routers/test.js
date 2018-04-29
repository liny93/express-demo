const controllers = require('../controllers')
let { register } = require('../util')

const express = require('express')
const router = express.Router()

register(router, 'get', '/:id', controllers.test.getUserInfo)

module.exports = router