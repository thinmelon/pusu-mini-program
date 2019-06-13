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
 * 	查询公司股东股份质押 - API网关
 */
const getStockSharePledge = (code) => {
    return `${PREFIX_FINANCE_SERVER_LESS}/stock/pledge/${code}`;
}

/**
 * 	获取A股基本面数据，如PE、PB等
 */
const getStockFundmental = () => {
    return `${PREFIX_FINANCE_SERVER_LESS}/stock/fundmental`;
}

/**
 * 	获取港股基本面数据，如PE、PB等
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
    getStockSharePledge: getStockSharePledge,
    getStockFundmental: getStockFundmental,
    getHKStockFundmental: getHKStockFundmental
}