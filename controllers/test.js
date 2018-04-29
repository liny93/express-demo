
const { TestService } = require('../service')
const { resJson } = require('../util')

module.exports.getUserInfo = async (req, res) => {
    const id = req.params.id
    const user = await TestService.getInstance().getUserInfo(+id)

    if (user) return resJson(res, user)
    else return resJson(res, 400, 'not exist')
}