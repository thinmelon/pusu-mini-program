const moment = require('../lib/moment.min.js')

/**
 *  格式化日期
 */
function formatDateString(dateStr) {
    return moment(dateStr).format('YYYY年M月D日 H:mm:ss')
}

function sortDate(a, b) {
    const _a = moment(a.year + '-' + a.month + '-' + a.day)
    const _b = moment(b.year + '-' + b.month + '-' + b.day)
    return _a.isAfter(_b) ? 1 : -1
}

function diff(a, b) {
    const _a = moment(a.year + '-' + a.month + '-' + a.day)
    const _b = moment(b || Date.now())
    return _a.diff(_b, 'days')
}

module.exports = {
    formatDateString,
    sortDate,
    diff
}