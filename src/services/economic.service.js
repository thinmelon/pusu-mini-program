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
 * 	十大股东持股情况
 */
const getStockHolder = (code) => {
    return __WX_API_PROMISE__.getRequest(__URI__.getStockHolder(code), {});
}

/**
 * 	十大流通股东持股情况
 */
const getStockFloatHolder = (code) => {
    return __WX_API_PROMISE__.getRequest(__URI__.getStockFloatHolder(code), {});
}

/**
 * 	公司股东人数 - API网关
 */
const getStockHolderNumber = (code) => {
    return __WX_API_PROMISE__.getRequest(__URI__.getStockHolderNumber(code), {});
}

/**
 * 	股东持股集中度 - API网关
 */
const getStockHolderConcentration = (code) => {
    return __WX_API_PROMISE__.getRequest(__URI__.getStockHolderConcentration(code), {});
}

/**
 * 	公司股东实际控制人 - API网关
 */
const getStockHolderController = (code) => {
    return __WX_API_PROMISE__.getRequest(__URI__.getStockHolderController(code), {});
}

/**
 * 	公司股本变动 - API网关
 */
const getStockHolderChange = (code) => {
    return __WX_API_PROMISE__.getRequest(__URI__.getStockHolderChange(code), {});
}

/**
 * 	上市公司高管持股变动 - API网关
 */
const getStockHolderManagerChange = (code) => {
    return __WX_API_PROMISE__.getRequest(__URI__.getStockHolderManagerChange(code), {});
}

/**
 * 	股东增（减）持情况 - API网关
 */
const getStockHolderChangeDate = (code) => {
    return __WX_API_PROMISE__.getRequest(__URI__.getStockHolderChangeDate(code), {});
}

/**
 * 	查询公司股东股份质押
 */
const getStockSharePledge = (code) => {
    return __WX_API_PROMISE__.getRequest(__URI__.getStockSharePledge(code), {});
}

/**
 * 	公司股东股份冻结 - API网关
 */
const getStockFreeze = (code) => {
    return __WX_API_PROMISE__.getRequest(__URI__.getStockFreeze(code), {});
}

/**
 * 	受限股份实际解禁日期 - API网关
 */
const getStockLiftingDate = (code) => {
    return __WX_API_PROMISE__.getRequest(__URI__.getStockLiftingDate(code), {});
}

/**
 * 	受限股份流通上市日期 - API网关
 */
const getStockRestrictedListDate = (code) => {
    return __WX_API_PROMISE__.getRequest(__URI__.getStockRestrictedListDate(code), {});
}

/**
 * 	个股报告期资产负债表 - API网关
 */
const getStockBalanceSheet = (code) => {
    return __WX_API_PROMISE__.getRequest(__URI__.getStockBalanceSheet(code), {});
}

/**
 * 	个股报告期利润表 - API网关
 */
const getStockIncomeStatement = (code) => {
    return __WX_API_PROMISE__.getRequest(__URI__.getStockIncomeStatement(code), {});
}

/**
 * 	个股报告期现金流表 - API网关
 */
const getStockCashFlowStatement = (code) => {
    return __WX_API_PROMISE__.getRequest(__URI__.getStockCashFlowStatement(code), {});
}

/**
 * 	个股报告期指标表 - API网关
 */
const getStockIndicators = (code) => {
    return __WX_API_PROMISE__.getRequest(__URI__.getStockIndicators(code), {});
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

/**
 * 	获取美股基本面数据
 */
const getUSAStockFundmental = (code) => {
    return __WX_API_PROMISE__.getRequest(__URI__.getUSAStockFundmental(code), {});
}

/**
 * 	获取K线图
 */
const getStockKLine = (request) => {
    return __WX_API_PROMISE__.getRequest(__URI__.getStockKLine(request.market, request.code), {});
}

/**
 * 	搜索
 */
const searchStock = (request) => {
    return __WX_API_PROMISE__.getRequest(__URI__.searchStock(request.market, request.keyword), {});
}

/**
 * 	搜索中标公告
 */
const searchTenderings = (request) => {
    return __WX_API_PROMISE__.postRequest(__URI__.searchTenderings(), request);
}

/**
 * 	搜索房地产投资统计数据
 */
const searchRealEstateStatistics = (request) => {
    return __WX_API_PROMISE__.postRequest(__URI__.searchRealEstateStatistics(), request);
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
    //	持股情况
    getStockHolder: getStockHolder,
    getStockFloatHolder: getStockFloatHolder,
    getStockHolderNumber: getStockHolderNumber,
    getStockHolderConcentration: getStockHolderConcentration,
    getStockHolderController: getStockHolderController,
    getStockHolderChange: getStockHolderChange,
    getStockHolderManagerChange: getStockHolderManagerChange,
    getStockHolderChangeDate: getStockHolderChangeDate,
    getStockSharePledge: getStockSharePledge,
    getStockFreeze: getStockFreeze,
    getStockLiftingDate: getStockLiftingDate,
    getStockRestrictedListDate: getStockRestrictedListDate,
    getStockBalanceSheet: getStockBalanceSheet,
    getStockIncomeStatement: getStockIncomeStatement,
    getStockCashFlowStatement: getStockCashFlowStatement,
    getStockIndicators: getStockIndicators,
    //	基本面
    getStockFundmental: getStockFundmental,
    getHKStockFundmental: getHKStockFundmental,
    getUSAStockFundmental: getUSAStockFundmental,
    getStockKLine: getStockKLine,
    searchStock: searchStock,
    //  招投标
    searchTenderings: searchTenderings,
    //	房地产
    searchRealEstateStatistics: searchRealEstateStatistics
}