const __URI__ = require('../utils/uri.constant.js');
const __CRYPT__ = require('../utils/crypt.js');
const __MOMENT__ = require('../lib/moment.min.js');
const __WX_API_PROMISE__ = require('../utils/wx.api.promise.js');

/**
 *  中债国债收益率 API
 *  	start: 起始日期
 *  	end:  截止日期
 *      默认取近一月的数据
 */
const getChinaBondYieldRate = (
    start = __MOMENT__().subtract(1, 'years').format('YYYY/MM/DD'),
    end = __MOMENT__().format('YYYY/MM/DD')) => {
    const url = __URI__.getChinaBondYieldRate(
        encodeURIComponent(__CRYPT__.encryptData('')),
        encodeURIComponent(start),
        encodeURIComponent(end));
    return __WX_API_PROMISE__.getRequest(url, {});
}

module.exports = {
    getChinaBondYieldRate: getChinaBondYieldRate
}