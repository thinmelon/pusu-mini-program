/**
 *          莆田市人民政府 -   政务公开    -   统计数据
 */
const REAL_ESTATE = 'http://www.putian.gov.cn/was5/web/search?channelid=210831&templet=advsch.jsp&sortfield=-docorderpri%2C-docreltime&classsql=chnlid%3D224&prepage=150&page=';

/**
 *          莆田市人民政府 -   政务公开    -   统计数据
 */
const ESTATES_DEVELOPMENT_INVESTMENT = 'http://www.putian.gov.cn/was5/web/search?channelid=210831&templet=advsch.jsp&sortfield=-docorderpri%2C-docreltime&classsql=chnlid%3D224&prepage=150&page=%s' //   房地产开发投资
const RESIDENT_POPULATION = 'http://putian.gov.cn/tjnj/pttjnj2019/htms/13.htm' //  2019年莆田统计年鉴 - 主要年份常住总人口及人口变动

/**
 *          商品房签约统计
 * 
 *          商品信息公开专栏 - 首页 
 *          栏目： 商品房签约统计 | 可售楼盘统计 | 商品房预售许可公示 | 商品住宅月销售排行榜 | 可售房屋查询 | 商品房合同签约信息查询
 */
const BUREAU_HOUSING_HOST = 'http://110.89.45.7:8082'
const HOUSE_CONTRACT_STATISTICS = BUREAU_HOUSING_HOST
const AVAILABLE_FOR_SALE = BUREAU_HOUSING_HOST + '/House/ListCanSell_Stats?place=%s'
const AVAILABLE_FOR_SALE_PAGING = BUREAU_HOUSING_HOST + '/House/ListCanSell_Stats?pagenumber=%s&pagesize=20&place=%s'
const TOP_MONTH_SELL = BUREAU_HOUSING_HOST + '/House/link/NewHouse_TopMonthSell'
const TOP_PRE_SELL = BUREAU_HOUSING_HOST + '/House/link/ListPreSell?Area=%s'

/**
 *          巨潮资讯    -   宏观
 */
const CNINFO_MACRO_CPI = 'http://webapi.cninfo.com.cn/api/macro/p_CPI?access_token=%s'; //  全国居民消费价格指数
const CNINFO_MACRO_PMI = 'http://webapi.cninfo.com.cn/api/macro/p_PMI?access_token=%s'; //  采购经理指数（月度）
const CNINFO_MACRO_PPI = 'http://webapi.cninfo.com.cn/api/macro/p_PPI?access_token=%s'; //  工业生产者出厂价格指数
const CNINFO_MACRO_MONEY_SUPPLY = 'http://webapi.cninfo.com.cn/api/macro/p_macro9034?access_token=%s'; //  货币供应量月度统计表

/**
 *          中国人民银行
 */
const HISTORY_CHINA_TREASURY_YIELDS = 'http://yield.chinabond.com.cn/cbweb-pbc-web/pbc/historyQuery?startDate=%s&endDate=%s&gjqx=0&qxId=hzsylqx&locale=cn_ZH'; //  中国国债收益率曲线
const LOAN_PRIME_RATE = 'http://www.chinamoney.com.cn/ags/ms/cm-u-bk-currency/LprChrtCSV?startDate=%s' //  贷款基础利率

/**
 *          融360大数据研究院   -   房贷利率
 */

const MORTGAGE_RATE = 'https://www.r360insights.com/insights/houseData/chartsData'

/**
 *          聚合数据    -   汇率
 */
const JUHE_CURRENCY_EXCHANGE = 'http://op.juhe.cn/onebox/exchange/currency?key=%s&from=%s&to=%s';

/**
 *          金融界   -   股票账户统计
 */
const STOCK_ACCOUNT_NUMBER = 'http://data.jrj.com.cn/kaihu/stockAccountCountTop20.js';

/**
 *          巨潮资讯    -   沪深
 */
const CNINFO_API_HOST = 'webapi.cninfo.com.cn';
const CNINFO_API_OAUTH_TOKEN_PATH = '/api-cloud-platform/oauth2/token'; //  access token
const CNINFO_STOCK_HS_LIST = 'http://webapi.cninfo.com.cn/api/stock/p_stock2101?format=json&access_token=%s&@column=SECCODE,SECNAME,F001V'; //  沪深所有股票
const CNINFO_STOCK_HS_BALANCE_SHEET = 'http://webapi.cninfo.com.cn/api/stock/p_stock2300?scode=%s&type=071001&access_token=%s&@limit=12&@orderby=F001D:desc'; //  资产负债表
const CNINFO_STOCK_HS_PROFIT_STATEMENT = 'http://webapi.cninfo.com.cn/api/stock/p_stock2301?scode=%s&type=071001&access_token=%s&@limit=12&@orderby=F001D:desc'; //  利润表
const CNINFO_STOCK_HS_CASH_FLOW_STATEMENT = 'http://webapi.cninfo.com.cn/api/stock/p_stock2302?scode=%s&type=071001&access_token=%s&@limit=12&@orderby=F001D:desc'; //  现金流表
const CNINFO_STOCK_HS_INDICATORS = 'http://webapi.cninfo.com.cn/api/stock/p_stock2303?scode=%s&type=071001&access_token=%s&@limit=12&@orderby=F069D:desc'; //  指标表
const CNINFO_STOCK_HS_SHARE_PLEDGE = 'http://webapi.cninfo.com.cn/api/stock/p_stock2220?scode=%s&access_token=%s&@orderby=F009D:desc'; //  股份质押
const CNINFO_STOCK_HS_FLOAT_HOLDER = 'http://webapi.cninfo.com.cn/api/stock/p_stock2209?scode=%s&access_token=%s&@limit=10&@orderby=ENDDATE:desc'; //  十大流通股东持股情况
const CNINFO_STOCK_HS_FUND_SOURCE = 'http://webapi.cninfo.com.cn/api/stock/p_stock2234?scode=%s&access_token=%s&@limit=10&@orderby=F004D:desc'; //  募集资金来源
const CNINFO_STOCK_HS_INVESTMENT = 'http://webapi.cninfo.com.cn/api/stock/p_stock2236?scode=%s&access_token=%s&@limit=20&@orderby=DECLAREDATE:desc'; //  募集资金计划投资项目
const CNINFO_STOCK_HS_AUDIT = 'http://webapi.cninfo.com.cn/api/stock/p_stock2239?scode=%s&access_token=%s&@limit=12&@orderby=F001D:desc'; //  审计意见
const CNINFO_STOCK_HS_EXTERNAL_GUARANTEE = 'http://webapi.cninfo.com.cn/api/stock/p_stock2245?scode=%s&access_token=%s&@limit=10&@orderby=DECLAREDATE:desc'; //  对外担保
const CNINFO_STOCK_HS_PUNISHMENT = 'http://webapi.cninfo.com.cn/api/stock/p_stock2248?scode=%s&access_token=%s&@limit=10&@orderby=DECLAREDATE:desc'; //  公司受处罚表

/**
 *          巨潮资讯    -   港股
 */
const CNINFO_STOCK_HK_BALANCE_SHEET = 'http://webapi.cninfo.com.cn/api/hk/p_hk4023?scode=%s&access_token=%s&@limit=12&@orderby=ENDDATE:desc'; //  资产负债表
const CNINFO_STOCK_HK_PROFIT_STATEMENT = 'http://webapi.cninfo.com.cn/api/hk/p_hk4024?scode=%s&access_token=%s&@limit=12&@orderby=F001D:desc'; //  利润表
const CNINFO_STOCK_HK_CASH_FLOW_STATEMENT = 'http://webapi.cninfo.com.cn/api/hk/p_hk4019?scode=%s&access_token=%s&@limit=12&@orderby=F001D:desc'; //  现金流表
const CNINFO_STOCK_HK_INDICATORS = 'http://webapi.cninfo.com.cn/api/hk/p_hk4025?scode=%s&access_token=%s&@limit=12&@orderby=F069D:desc'; //  指标表
const CNINFO_STOCK_HK_SHARE_HOLDER_CHANGE = 'http://webapi.cninfo.com.cn/api/hk/p_hk4010?scode=%s&@limit=100&@orderby=F001D:desc&access_token=%s'; //  主要股东股权变动

/**
 *          聚合数据    -   各大市场的股票列表
 */
const JUHE_STOCK_SZ_LIST = 'http://web.juhe.cn:8080/finance/stock/szall?key=%s&page=%s&type=%s';
const JUHE_STOCK_SH_LIST = 'http://web.juhe.cn:8080/finance/stock/shall?key=%s&page=%s&type=%s';
const JUHE_STOCK_HK_LIST = 'http://web.juhe.cn:8080/finance/stock/hkall?key=%s&page=%s&type=%s';
const JUHE_STOCK_USA_LIST = 'http://web.juhe.cn:8080/finance/stock/usaall?key=%s&page=%s&type=%s';

module.exports = {
    //  住建局 - 商品房信息公开专栏
    REAL_ESTATE,
    BUREAU_HOUSING_HOST,
    HOUSE_CONTRACT_STATISTICS,
    AVAILABLE_FOR_SALE,
    AVAILABLE_FOR_SALE_PAGING,
    TOP_MONTH_SELL,
    TOP_PRE_SELL,
    //  莆田市人民政府官网
    ESTATES_DEVELOPMENT_INVESTMENT,
    RESIDENT_POPULATION,
    //  巨潮资讯    -   宏观
    CNINFO_MACRO_CPI,
    CNINFO_MACRO_PMI,
    CNINFO_MACRO_PPI,
    CNINFO_MACRO_MONEY_SUPPLY,
    //  中国人民银行
    HISTORY_CHINA_TREASURY_YIELDS,
    LOAN_PRIME_RATE,
    MORTGAGE_RATE,
    //  聚合数据
    JUHE_CURRENCY_EXCHANGE,
    //  金融界
    STOCK_ACCOUNT_NUMBER,
    //  巨潮资讯    -   沪深
    CNINFO_API_HOST,
    CNINFO_API_OAUTH_TOKEN_PATH,
    CNINFO_STOCK_HS_LIST,
    CNINFO_STOCK_HS_BALANCE_SHEET,
    CNINFO_STOCK_HS_PROFIT_STATEMENT,
    CNINFO_STOCK_HS_CASH_FLOW_STATEMENT,
    CNINFO_STOCK_HS_INDICATORS,
    CNINFO_STOCK_HS_SHARE_PLEDGE,
    CNINFO_STOCK_HS_FLOAT_HOLDER,
    CNINFO_STOCK_HS_FUND_SOURCE,
    CNINFO_STOCK_HS_INVESTMENT,
    CNINFO_STOCK_HS_AUDIT,
    CNINFO_STOCK_HS_EXTERNAL_GUARANTEE,
    CNINFO_STOCK_HS_PUNISHMENT,
    //  巨潮资讯    -   港股
    CNINFO_STOCK_HK_BALANCE_SHEET,
    CNINFO_STOCK_HK_SHARE_HOLDER_CHANGE,
    //  聚合数据
    JUHE_STOCK_SZ_LIST,
    JUHE_STOCK_SH_LIST,
    JUHE_STOCK_HK_LIST,
    JUHE_STOCK_USA_LIST
}