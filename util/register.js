const resJson = require('./resJson')
const fs = require('fs')
const path = require('path')

let register = async (router, method, args, userMiddleware, check) => {
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

    router[method](args, wrap)
}

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