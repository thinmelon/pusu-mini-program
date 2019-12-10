/**
 *  莆田市人民政府 -   政务公开    -   统计数据
 */
const REAL_ESTATE = 'http://www.putian.gov.cn/was5/web/search?channelid=210831&templet=advsch.jsp&sortfield=-docorderpri%2C-docreltime&classsql=chnlid%3D224&prepage=150&page=';

/**
 *          商品房签约统计
 * 
 * 商品信息公开专栏 - 首页 
 * 栏目： 商品房签约统计 | 可售楼盘统计 | 商品房预售许可公示 | 商品住宅月销售排行榜 | 可售房屋查询 | 商品房合同签约信息查询
 */
const BUREAU_HOUSING_HOST = 'http://110.89.45.7:8082'
const HOUSE_CONTRACT_STATISTICS = BUREAU_HOUSING_HOST
const AVAILABLE_FOR_SALE = BUREAU_HOUSING_HOST + '/House/ListCanSell_Stats?place=%s'
const AVAILABLE_FOR_SALE_PAGING = BUREAU_HOUSING_HOST + '/House/ListCanSell_Stats?pagenumber=%s&pagesize=20&place=%s'

module.exports = {
    REAL_ESTATE,
    BUREAU_HOUSING_HOST,
    HOUSE_CONTRACT_STATISTICS,
    AVAILABLE_FOR_SALE,
    AVAILABLE_FOR_SALE_PAGING
}