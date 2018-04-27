/**
 *  访问地址前缀
 */
const PROTOCOL = 'https://';
const HOST = 'www.thinmelon.cc';
const API = '/finance';
const PREFIX = PROTOCOL + HOST + API;
/**
 *  中债国债收益率
 */
const ChinaBondYieldRate = (from, to) => {
	return `${PREFIX}/bond/${from}-${to}`;
}

module.exports = {
	getChinaBondYieldRate: ChinaBondYieldRate
}