
const { TestService } = require('../service')
const { resJson } = require('../util')

module.exports.getUserInfo = async (req, res) => {
    const id = req.params.id
    const user = await TestService.getUserInfo(id)

    if (user) return resJson(res, user)
    return resJson(res, 400, 'not exist')
}