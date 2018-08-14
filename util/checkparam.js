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
    return (req, res, next) => {
        if (Array.isArray(model)) {
            const check = checkModel(req.body, model)
            if (check) return resJson(res, 400, check)
            next()
        } else {
            for (let val of ['params', 'query', 'body']) {
                if (Array.isArray(model[val])) {
                    const check = checkModel(req[val], model[val])
                    if (check) return resJson(res, 400, check)
                }
            }
            next()
        }
    }
}

function checkModel(obj, model) {
    for (let val of model) {
        if (!checkArray(val)) continue
        const key = val[0]
        if (val[1] && obj[key] == null) {
            return `the ${key} cannot be null`
        }
        if (obj[key] != null && CheckFun[val[2]] && !CheckFun[val[2]](obj[key], val[3])) {
            return `the value of ${key} is invalid`
        }
    }
    return false
}

function checkArray(model) {
    return CheckFun.isString(model[0]) && CheckFun.isBoolean(model[1]) && CheckFun.isString(model[2])
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

        let minCheckPassed = (!options.hasOwnProperty('min') || obj >= options.min)
        let maxCheckPassed = (!options.hasOwnProperty('max') || obj <= options.max)
        let ltCheckPassed = (!options.hasOwnProperty('lt') || obj < options.lt)
        let gtCheckPassed = (!options.hasOwnProperty('gt') || obj > options.gt)

        return float.test(obj) && minCheckPassed && maxCheckPassed && ltCheckPassed && gtCheckPassed
    },
    isString(str, options) {
        const isString = typeof str === 'string' || str instanceof String

        if (!isString) return false
        if (!options) return isString

        const check = { type: true }

        if (options.hasOwnProperty('length')) {
            const len = options.length
            check.minCheckPassed = (!len.hasOwnProperty('min') || str.length >= len.min)
            check.maxCheckPassed = (!len.hasOwnProperty('max') || str.length <= len.max)
            check.ltCheckPassed = (!len.hasOwnProperty('lt') || str.length < len.lt)
            check.gtCheckPassed = (!len.hasOwnProperty('gt') || str.length > len.gt)
        }

        check.subCheckPassed = (!options.hasOwnProperty('sub') || str.includes(options.sub))

        return !Object.values(check).includes(false)
    },
    isBoolean(obj) {
        return ['true', 'false', '1', '0'].includes(obj.toString())
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
        const int = /^(?:[-+]?(?:0|[1-9][0-9]*))$/
        if (!options) return regex.test(obj)

        let minCheckPassed = (!options.hasOwnProperty('min') || str >= options.min)
        let maxCheckPassed = (!options.hasOwnProperty('max') || str <= options.max)
        let ltCheckPassed = (!options.hasOwnProperty('lt') || str < options.lt)
        let gtCheckPassed = (!options.hasOwnProperty('gt') || str > options.gt)

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
    isIP(str, version = '') {
        const ipv4Maybe = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/
        const ipv6Block = /^[0-9A-F]{1,4}$/i
        version = String(version);
        if (!version) {
            return isIP(str, 4) || isIP(str, 6);
        } else if (version === '4') {
            if (!ipv4Maybe.test(str)) {
                return false;
            }
            const parts = str.split('.').sort((a, b) => a - b);
            return parts[3] <= 255;
        } else if (version === '6') {
            const blocks = str.split(':');
            let foundOmissionBlock = false;
            const foundIPv4TransitionBlock = isIP(blocks[blocks.length - 1], 4);
            const expectedNumberOfBlocks = foundIPv4TransitionBlock ? 7 : 8;

            if (blocks.length > expectedNumberOfBlocks) {
                return false;
            }
            if (str === '::') {
                return true;
            } else if (str.substr(0, 2) === '::') {
                blocks.shift();
                blocks.shift();
                foundOmissionBlock = true;
            } else if (str.substr(str.length - 2) === '::') {
                blocks.pop();
                blocks.pop();
                foundOmissionBlock = true;
            }

            for (let i = 0; i < blocks.length; ++i) {
                if (blocks[i] === '' && i > 0 && i < blocks.length - 1) {
                    if (foundOmissionBlock) {
                        return false;
                    }
                    foundOmissionBlock = true;
                } else if (foundIPv4TransitionBlock && i === blocks.length - 1) {
                } else if (!ipv6Block.test(blocks[i])) {
                    return false;
                }
            }
            if (foundOmissionBlock) {
                return blocks.length >= 1;
            }
            return blocks.length === expectedNumberOfBlocks;
        }
        return false;
    }
}

const checkType = (obj, typeName) => {
    const type = Object.prototype.toString.call(obj)
    return type === `[object ${typeName}]`
}