const moment = require('moment')

// 时间格式化
module.exports = (time, timezone) => {
    if (time == 'now' && timezone) {
        return moment().add(timezone, 'h').format('YYYY-MM-DD HH:mm:ss')
    }
    if (time && timezone) {
        return moment(time).add(timezone, 'h').format('YYYY-MM-DD HH:mm:ss')
    }
    return time ? moment().format('YYYY-MM-DD HH:mm:ss') : moment().format('YYYY-MM-DD HH:mm:ss')
}
