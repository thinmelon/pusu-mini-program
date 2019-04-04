/**
 *  访问地址前缀
 */
const PROTOCOL = 'https://';
const HOST = 'www.pusudo.cn';
const PREFIX_FINANCE = PROTOCOL + HOST + '/finance';
const PREFIX_PLATFORM = PROTOCOL + HOST + '/platform';

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
 *  中债国债收益率
 */
const ChinaBondYieldRate = (session, from, to) => {
    return `${PREFIX_FINANCE}/bond/${from}-${to}?session=${session}`;
}

const ChinaTreasuryYieldsCurve = (from, to) => {
    return `https://finance.pusudo.cn/china/treasury/yields/curve/${from}/${to}`;
}

module.exports = {
    checkTemplateValidity: checkTemplateValidity,
    userLogin: userLogin,
    getChinaBondYieldRate: ChinaBondYieldRate,
    getChinaTreasuryYieldsCurve: ChinaTreasuryYieldsCurve
}