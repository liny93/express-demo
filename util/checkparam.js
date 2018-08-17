const path = require('path')
const resJson = require('./resJson')

const modelPath = '../models/params/' // 参数模型所在文件夹

/**
 * 参数校检
 * @param {参数模型所在文件} modelGroup 
 * @param {参数模型名称} modelName 
 */
module.exports = (modelGroup, modelName) => {
    const model = require(path.resolve(__dirname, modelPath + modelGroup))[modelName]
    if (!checkArray(model)) throw Error(`please check your parameter model about ${modelGroup} - ${modelName}`)
    return (req, res, next) => {
        if (Array.isArray(model)) {
            const check = checkModel(req.body, model)
            if (typeof check === 'string') return resJson(res, 400, check)
            req.body = check
            next()
        } else {
            for (let val of ['params', 'query', 'body']) {
                if (Array.isArray(model[val])) {
                    const check = checkModel(req[val], model[val])
                    if (typeof check === 'string') return resJson(res, 400, check)
                    req[val] = check
                }
            }
            next()
        }
    }
}

/**
 * 做参数检查，根据定义的模板，对参数进行校检，转换
 * @param {前端传入参数} obj 
 * @param {定义参数模板} model 
 */
function checkModel(obj, model) {
    const newParam = {}
    for (let val of model) {
        if (obj[val.frontName] == null) {
            if (val.noEmpty) return `the ${val.frontName} cannot be null`
            continue
        }
        if (!CheckFun[val.fun](obj[val.frontName], val.options)) return `the value of ${val.frontName} is invalid`
        if (val.deepModel) {
            if (val.fun === 'isObject') {
                newParam[val.backName] = checkModel(obj[val.frontName], val.deepModel)
            }
            if (val.fun === 'isArray') {
                newParam[val.backName] = obj[val.frontName].map(v => checkModel(v, val.deepModel))
            }
        } else {
            newParam[val.backName] = obj[val.frontName]
        }
    }
    return newParam
}

/**
 * 程序启动时检查参数模板是否符合标准
 * @param {定义参数模板} model 
 */
function checkArray(model) {
    if (!Array.isArray(model)) {
        model = [...model.params || [], ...model.query || [], ...model.body || []]
    }
    for (let val of model) {
        const frontNameCheck = val.hasOwnProperty('frontName') && CheckFun.isString(val.frontName)
        const backNameCheck = val.hasOwnProperty('backName') && CheckFun.isString(val.backName)
        const noEmptyCheck = val.hasOwnProperty('noEmpty') && CheckFun.isBoolean(val.noEmpty)
        const funCheck = val.hasOwnProperty('fun') && CheckFun.hasOwnProperty(val.fun)
        const deepCheck = val.hasOwnProperty('deepModel') ? ['isObject', 'isArray'].includes(val.fun) : true
        if (!frontNameCheck || !backNameCheck || !noEmptyCheck || !funCheck || !deepCheck) return false
    }
    return true
}

// 校检函数
// reference from validator
const CheckFun = {
    ownFun(obj, fun) {
        if (!checkType(fun, 'Function')) return false
        return fun(obj)
    },
    isObject(obj) {
        return checkType(obj, 'Object')
    },
    isArray(obj) {
        return checkType(obj, 'Array')
    },
    isNumber(obj, options) {
        const float = new RegExp(`^(?:[-+])?(?:[0-9]+)?(?:\\.[0-9]*)?(?:[eE][\\+\\-]?(?:[0-9]+))?$`)

        if (!options) return float.test(obj)

        let minCheckPassed = !options.hasOwnProperty('min') || obj >= options.min
        let maxCheckPassed = !options.hasOwnProperty('max') || obj <= options.max
        let ltCheckPassed = !options.hasOwnProperty('lt') || obj < options.lt
        let gtCheckPassed = !options.hasOwnProperty('gt') || obj > options.gt

        return float.test(obj) && minCheckPassed && maxCheckPassed && ltCheckPassed && gtCheckPassed
    },
    isString(str, options) {
        const isString = typeof str === 'string' || str instanceof String

        if (!isString) return false
        if (!options) return isString

        const check = { type: true }

        if (options.hasOwnProperty('length')) {
            const len = options.length
            check.minCheckPassed = !len.hasOwnProperty('min') || str.length >= len.min
            check.maxCheckPassed = !len.hasOwnProperty('max') || str.length <= len.max
            check.ltCheckPassed = !len.hasOwnProperty('lt') || str.length < len.lt
            check.gtCheckPassed = !len.hasOwnProperty('gt') || str.length > len.gt
        }

        check.subCheckPassed = (!options.hasOwnProperty('sub') || str.includes(options.sub))

        return !Object.values(check).includes(false)
    },
    isBoolean(obj) {
        return obj.toString() === 'true' || obj.toString() === 'false'
    },
    isNull(obj) {
        return checkType(obj, 'Null')
    },
    isUndefined(obj) {
        return checkType(obj, 'Undefined')
    },
    isFunction(obj) {
        return checkType(obj, 'Function')
    },
    isDate(obj) {
        const date = Date.parse(obj)
        return !isNaN(date)
    },
    isInt(obj, options) {
        const regex = /^(?:[-+]?(?:0|[1-9][0-9]*))$/
        if (!options) return regex.test(obj)

        let minCheckPassed = !options.hasOwnProperty('min') || obj >= options.min
        let maxCheckPassed = !options.hasOwnProperty('max') || obj <= options.max
        let ltCheckPassed = !options.hasOwnProperty('lt') || obj < options.lt
        let gtCheckPassed = !options.hasOwnProperty('gt') || obj > options.gt

        return regex.test(obj) && minCheckPassed && maxCheckPassed && ltCheckPassed && gtCheckPassed
    },
    isIn(obj, options) {
        if (Array.isArray(options)) {
            return options.includes(obj)
        } else if (typeof options === 'object') {
            return options.hasOwnProperty(obj)
        } else {
            return false
        }
    },
    isIP(str) {
        const ipv4Maybe = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/
        if (!ipv4Maybe.test(str)) {
            return false;
        }
        const parts = str.split('.').sort((a, b) => a - b);
        return parts[3] <= 255;
    }
}

const checkType = (obj, typeName) => {
    const type = Object.prototype.toString.call(obj)
    return type === `[object ${typeName}]`
}