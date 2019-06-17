/**
 *  访问地址前缀
 */
const PROTOCOL = 'https://';
const HOST = 'www.pusudo.cn';
const PREFIX_FINANCE = PROTOCOL + HOST + '/finance';
const PREFIX_STORAGE = PROTOCOL + HOST + '/oss';
const PREFIX_PLATFORM = PROTOCOL + HOST + '/platform';
//	API网关自定义域名
const PREFIX_FINANCE_SERVER_LESS = 'https://finance.pusudo.cn'; //	金融
const PREFIX_LIFE_SERVER_LESS = 'https://life.pusudo.cn'; //	生活

/**
 * 模板有效性验证
 */
const checkTemplateValidity = () => {
    return `${PREFIX_PLATFORM}/template/ever/bought`;
}

/**
 *   用户登录
 */
const userLogin = (appid) => {
    return `${PREFIX_PLATFORM}/miniprogram/${appid}`;
}

/**
 * 				生活
 */

/**
 *  公众号文章详情地址
 *  示例：https://life.pusudo.cn/official/news/2twVHtM2mfXSR4lPiuLEKhTXB3G02pWw
 */
const fetchOfficialNews = (collection) => {
    return `${PREFIX_LIFE_SERVER_LESS}/official/news/${collection}`;
}

/**
 * 	获取餐馆列表
 */
const getRestaurants = () => {
    return `${PREFIX_LIFE_SERVER_LESS}/restaurants`;
}

/**
 * 	获取标签列表
 */
const getTags = () => {
    return `${PREFIX_LIFE_SERVER_LESS}/tags`;
}

/**
 *  绑定标签
 */
const bindTag = () => {
    return `${PREFIX_LIFE_SERVER_LESS}/restaurant/tag`;
}

/**
 * 	移除标签
 */
const removeTag = (id, tag) => {
    return `${PREFIX_LIFE_SERVER_LESS}/restaurant/tag?id=${id}&tag=${tag}`;
}

/**
 * 				金融
 */

/**
 *  中债国债收益率 - 点滴后台
 */
const ChinaBondYieldRate = (session, from, to) => {
    return `${PREFIX_FINANCE}/bond/${from}-${to}?session=${session}`;
}

/**
 *  中债国债收益率 - API网关
 */
const ChinaTreasuryYieldsCurve = (from, to) => {
    return `${PREFIX_FINANCE_SERVER_LESS}/china/treasury/yields/curve/${from}/${to}`;
}

/**
 * 	实时汇率兑换 - API网关
 */
const queryCurrencyExchange = (from, to) => {
    return `${PREFIX_FINANCE_SERVER_LESS}/exchange/${from}/${to}`;
}

/**
 * 	货币列表 - API网关
 */
const getCurrencyList = () => {
    return `${PREFIX_FINANCE_SERVER_LESS}/currency/list`;
}

/**
 * 	上海黄金交易所 - API网关
 */
const getShangHaiGold = () => {
    return `${PREFIX_FINANCE_SERVER_LESS}/gold/shanghai`;
}

/**
 * 	上海期货交易所 - API网关
 */
const getShanagHaiFuture = () => {
    return `${PREFIX_FINANCE_SERVER_LESS}/future/shanghai`;
}

/**
 * 	银行账户黄金 - API网关
 */
const getBankGold = () => {
    return `${PREFIX_FINANCE_SERVER_LESS}/gold/bank`;
}

/**
 * 	查询公司公告资讯 - API网关
 */
const getStockAnnouncement = (code) => {
    return `${PREFIX_FINANCE_SERVER_LESS}/stock/announcement/${code}`;
}

/**
 * 	查询公司分红增发 - API网关
 */
const getStockDividends = (code) => {
    return `${PREFIX_FINANCE_SERVER_LESS}/stock/dividends/${code}`;
}

/**
 * 	公司增发股票实施方案 - API网关
 */
const getStockSecondaryPublicOffering = (code) => {
    return `${PREFIX_FINANCE_SERVER_LESS}/stock/spo/${code}`;
}

/**
 * 	公司配股实施方案 - API网关
 */
const getStockRationedShare = (code) => {
    return `${PREFIX_FINANCE_SERVER_LESS}/stock/rationed/${code}`;
}

/**
 * 	募集资金投资项目计划 - API网关
 */
const getStockRaisingFundUsage = (code) => {
    return `${PREFIX_FINANCE_SERVER_LESS}/stock/raising/${code}`;
}

/**
 * 	十大股东持股情况 - API网关
 */
const getStockHolder = (code) => {
    return `${PREFIX_FINANCE_SERVER_LESS}/stock/holder/${code}`;
}

/**
 * 	十大流通股东持股情况 - API网关
 */
const getStockFloatHolder = (code) => {
    return `${PREFIX_FINANCE_SERVER_LESS}/stock/float/holder/${code}`;
}

/**
 * 	公司股东人数 - API网关
 */
const getStockHolderNumber = (code) => {
    return `${PREFIX_FINANCE_SERVER_LESS}/stock/number/${code}`;
}

/**
 * 	股东持股集中度 - API网关
 */
const getStockHolderConcentration = (code) => {
    return `${PREFIX_FINANCE_SERVER_LESS}/stock/concentration/${code}`;
}

/**
 * 	公司股东实际控制人 - API网关
 */
const getStockHolderController = (code) => {
    return `${PREFIX_FINANCE_SERVER_LESS}/stock/controller/${code}`;
}

/**
 * 	公司股本变动 - API网关
 */
const getStockHolderChange = (code) => {
    return `${PREFIX_FINANCE_SERVER_LESS}/stock/holder/change/${code}`;
}

/**
 * 	上市公司高管持股变动 - API网关
 */
const getStockHolderManagerChange = (code) => {
    return `${PREFIX_FINANCE_SERVER_LESS}/stock/manager/holder/change/${code}`;
}

/**
 * 	股东增（减）持情况 - API网关
 */
const getStockHolderChangeDate = (code) => {
    return `${PREFIX_FINANCE_SERVER_LESS}/stock/holder/change/date/${code}`;
}

/**
 * 	查询公司股东股份质押 - API网关
 */
const getStockSharePledge = (code) => {
    return `${PREFIX_FINANCE_SERVER_LESS}/stock/pledge/${code}`;
}

/**
 * 	公司股东股份冻结 - API网关
 */
const getStockFreeze = (code) => {
    return `${PREFIX_FINANCE_SERVER_LESS}/stock/freeze/${code}`;
}

/**
 * 	受限股份实际解禁日期 - API网关
 */
const getStockLiftingDate = (code) => {
    return `${PREFIX_FINANCE_SERVER_LESS}/stock/lifting/date/${code}`;
}

/**
 * 	受限股份流通上市日期 - API网关
 */
const getStockRestrictedListDate = (code) => {
    return `${PREFIX_FINANCE_SERVER_LESS}/stock/restricted/list/date/${code}`;
}

/**
 * 	获取A股基本面数据，如PE、PB等	- API网关
 */
const getStockFundmental = () => {
    return `${PREFIX_FINANCE_SERVER_LESS}/stock/fundmental`;
}

/**
 * 	获取港股基本面数据，如PE、PB等	- API网关
 */
const getHKStockFundmental = () => {
    return `${PREFIX_FINANCE_SERVER_LESS}/stock/hk/fundmental`;
}

module.exports = {
    checkTemplateValidity: checkTemplateValidity,
    userLogin: userLogin,
    /**
     * 	生活
     */
    fetchOfficialNews: fetchOfficialNews,
    getRestaurants: getRestaurants,
    getTags: getTags,
    bindTag: bindTag,
    removeTag: removeTag,
    /**
     * 	债券
     */
    getChinaBondYieldRate: ChinaBondYieldRate,
    getChinaTreasuryYieldsCurve: ChinaTreasuryYieldsCurve,
    /**
     * 	汇率
     */
    queryCurrencyExchange: queryCurrencyExchange,
    getCurrencyList: getCurrencyList,
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
    //	基本面
    getStockFundmental: getStockFundmental,
    getHKStockFundmental: getHKStockFundmental
}