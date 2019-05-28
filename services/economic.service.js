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
    // const url = __URI__.getChinaBondYieldRate(
    //     encodeURIComponent(__CRYPT__.encryptData('')),
    //     encodeURIComponent(start),
    //     encodeURIComponent(end));
    const url = __URI__.getChinaTreasuryYieldsCurve(
        encodeURIComponent(start),
        encodeURIComponent(end));
    return __WX_API_PROMISE__.getRequest(url, {});
}

/**
 * 		汇率 API
 */

/**
 * 		货币列表
 */
const getCurrencyList = () => {
    return __WX_API_PROMISE__.getRequest(__URI__.getCurrencyList(), {});
}

/**
 * 	实时货币汇率查询换算
 */
const queryCurrencyExchange = (from, to) => {
    return __WX_API_PROMISE__.getRequest(
        __URI__.queryCurrencyExchange(from || 'USD', to || 'CNY'), {});
}

/**
 * 		黄金 API
 */

/**
 * 		上海黄金交易所
 */
const getShangHaiGold = () => {
    return __WX_API_PROMISE__.getRequest(__URI__.getShangHaiGold(), {});
}

/**
 * 		上海期货交易所
 */
const getShanagHaiFuture = () => {
    return __WX_API_PROMISE__.getRequest(__URI__.getShanagHaiFuture(), {});
}

/**
 * 		银行账户黄金
 */
const getBankGold = () => {
    return __WX_API_PROMISE__.getRequest(__URI__.getBankGold(), {});
}

module.exports = {
    /**
     * 	债券
     */
    getChinaBondYieldRate: getChinaBondYieldRate,
    /**
     * 	汇率
     */
    getCurrencyList: getCurrencyList,
    queryCurrencyExchange: queryCurrencyExchange,
    /**
     * 	黄金
     */
    getShangHaiGold: getShangHaiGold,
    getShanagHaiFuture: getShanagHaiFuture,
    getBankGold: getBankGold
}