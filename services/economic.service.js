const __URI__ = require('../utils/uri.constant.js');
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

/**
 * 		股票	API
 */

/**
 * 	查询公司公告资讯
 */
const getStockAnnouncement = (code) => {
    return __WX_API_PROMISE__.getRequest(__URI__.getStockAnnouncement(code), {});
}

/**
 * 	查询公司分红转增
 */
const getStockDividends = (code) => {
    return __WX_API_PROMISE__.getRequest(__URI__.getStockDividends(code), {});
}

/**
 * 	公司增发股票实施方案
 */
const getStockSecondaryPublicOffering = (code) => {
    return __WX_API_PROMISE__.getRequest(__URI__.getStockSecondaryPublicOffering(code), {});
}

/**
 * 	公司配股实施方案
 */
const getStockRationedShare = (code) => {
    return __WX_API_PROMISE__.getRequest(__URI__.getStockRationedShare(code), {});
}

/**
 * 	募集资金投资项目计划
 */
const getStockRaisingFundUsage = (code) => {
    return __WX_API_PROMISE__.getRequest(__URI__.getStockRaisingFundUsage(code), {});
}

/**
 * 	查询公司股东股份质押
 */
const getStockSharePledge = (code) => {
    return __WX_API_PROMISE__.getRequest(__URI__.getStockSharePledge(code), {});
}

/**
 * 	获取A股基本面数据，如PE、PB等
 */
const getStockFundmental = (request) => {
    return __WX_API_PROMISE__.postRequest(__URI__.getStockFundmental(), {
        package: JSON.stringify(request)
    });
}

/**
 * 	获取港股基本面数据，如PE、PB等
 */
const getHKStockFundmental = (request) => {
    return __WX_API_PROMISE__.postRequest(__URI__.getHKStockFundmental(), {
        package: JSON.stringify(request)
    });
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
    getBankGold: getBankGold,
    /**
     * 	股票
     */
    getStockAnnouncement: getStockAnnouncement,
    getStockDividends: getStockDividends,
    getStockSecondaryPublicOffering: getStockSecondaryPublicOffering,
    getStockRationedShare: getStockRationedShare,
    getStockRaisingFundUsage: getStockRaisingFundUsage,
    getStockSharePledge: getStockSharePledge,
    getStockFundmental: getStockFundmental,
    getHKStockFundmental: getHKStockFundmental
}