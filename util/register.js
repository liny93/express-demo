const resJson = require('./resJson')
const fs = require('fs')
const path = require('path')

//  路由注册，统一进行try  catch
let register = async (router, method, args, userMiddleware, ...middleware) => {
    let wrap = async (req, res, next) => {
        try {
            await userMiddleware(req, res, next)
        } catch (e) {
            addLog(req, e)
            console.log(e)
            if (e instanceof ParamError) return resJson(res, 400, e.message)
            return resJson(res, 400, 'Invalid param')
        }
    }
    router[method](args, ...middleware, wrap)
}

// 错误记录，低配日志
function addLog(req, error) {
    const url = req.originalUrl || req.url
    const errMsg = error.stack
    let errFileMsg = `
    TIME: ${new Date().toLocaleString()}
    URL: ${url}
    MSG: ${errMsg}
    `
    if (req.method !== 'GET') errFileMsg += `BODY: ${JSON.stringify(req.body)}`
    fs.appendFileSync(path.resolve(__dirname, '../logs/error.log'), errFileMsg + '\n\n', 'utf8')
}

class ParamError extends Error {
    constructor(msg, code = 400) {
        super(msg);
        this.code = code;
    }
}

module.exports = register