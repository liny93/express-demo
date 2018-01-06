const { db, models } = require('../models')
const resJson = require('../util/resJson')

module.exports.getUserInfo = async (req, res) => {

    let num = req.query.num
    let user = await models.user.findById(num)

    if (user) return resJson(res, user)
    else return resJson(res, 400, 'Invalid param')

}