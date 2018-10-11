const fs = require('fs')
const path = require('path')

const ParamError = require('./paramerror')
const resJson = require('./resJson')

//  路由注册，统一进行try  catch
let register = (router, method, args, userMiddleware, ...middleware) => {
    let wrap = async (req, res, next) => {
        try {
            await userMiddleware(req, res, next)
        } catch (e) {
            if (e instanceof ParamError) return resJson(res, e.code, e.msg)
            addLog(req, e)
            console.log(e)
            return resJson(res, 500, 'SERVER ERROR')
        }
    }
    router[method](args, ...middleware, wrap)
}

// 错误记录，低配日志
function addLog(req, error) {
    const url = req.originalUrl || req.url
    const errMsg = error.message
    const errStack = error.stack
    const errMsgArr = errMsg.split(':')
    let errFileMsg = `
    TIME: ${new Date().toLocaleString()}
    URL: ${url}
    LEVEL: ${errLevel[error.name]}
    TIP: ${errList[errMsgArr.length > 1 ? errMsgArr[0] : errStack.split(':')[0]]}
    MSG: ${(errMsgArr.length > 1 ? errMsgArr[1] : errMsg).trim()}
    AT: ${errStack.split('\n')[1].trim()}
    `
    if (req.method !== 'GET') errFileMsg += `BODY: ${JSON.stringify(req.body)} `
    fs.appendFileSync(path.resolve(__dirname, '../logs/error.log'), errFileMsg + '\n\n', 'utf8')
}

const errLevel = {
    "Error": "system",
    "TypeError": "system",
    "ReferenceError": "system",
    "SequelizeValidationError": "sequelize",
    "ValidationError": "sequelize",
    "SequelizeForeignKeyConstraintError": "sequelize",
    "SequelizeDatabaseError": "sequelize",
    "SequelizeConnectionError": "sequelize"
}

const errList = {
    "Illegal arguments": "非法参数",
    "notNull Violation": "数据库非空字段没有数据",
    "Cannot delete or update a parent row": "无法删除或修改有外键关联的字段",
    "TypeError": "变量使用不正确",
    "ReferenceError": "变量未定义",
    "SequelizeDatabaseError": "数据库字段类型错误",
    "Incorrect integer value": "数据库字段类型错误",
    "connect ETIMEDOUT": "数据库连接超时"
}

module.exports = register
