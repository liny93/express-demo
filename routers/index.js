/**
 * 路由统一出口
 * @param {express} app 
 */
module.exports = function (app) {
    app.use('/user', require('./user'))
}
