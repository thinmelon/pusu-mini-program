/**
 *  知识体系（很帅的投资客）
 * 
 */
const HIERARCHY = [{
    subject: "Bond",
    articles: [{
        title: "什么是收益率曲线倒挂？",
        href: "cloud://diandi-software-cloud.6469-diandi-software-cloud-1300349273/articles/yield-curve-inversion/",
        num: 11
    }]
}, {
    subject: "Money",
    articles: [{
        title: "货币信用框架理论",
        href: "cloud://diandi-software-cloud.6469-diandi-software-cloud-1300349273/articles/financing-aggregate/",
        num: 15
    }]
}, {
    subject: "Currency",
    articles: [{
        title: "什么是中间价？",
        href: "cloud://diandi-software-cloud.6469-diandi-software-cloud-1300349273/articles/RMB-exchange-rate/",
        num: 8
    }, {
        title: "什么是不可能三角？",
        href: "cloud://diandi-software-cloud.6469-diandi-software-cloud-1300349273/articles/impossible-trinity/",
        num: 10
    }]
}, {
    subject: "Estates",
    articles: [{
        title: "什么是交易方程式？",
        href: "cloud://diandi-software-cloud.6469-diandi-software-cloud-1300349273/articles/equation-of-exchange/",
        num: 13
    }, {
        title: "什么是通货紧缩？",
        href: "cloud://diandi-software-cloud.6469-diandi-software-cloud-1300349273/articles/Deflation/",
        num: 7
    }, {
        title: "央行是怎么印钱的？",
        href: "cloud://diandi-software-cloud.6469-diandi-software-cloud-1300349273/articles/M2/",
        num: 13
    }, {
        title: "利率的本质是什么？",
        href: "cloud://diandi-software-cloud.6469-diandi-software-cloud-1300349273/articles/interest-rate/",
        num: 17
    }, {
        title: "央行的货币政策工具有哪些？",
        href: "cloud://diandi-software-cloud.6469-diandi-software-cloud-1300349273/articles/monetary-policy-instruments/",
        num: 19
    }, {
        title: "什么是棚改货币化？",
        href: "cloud://diandi-software-cloud.6469-diandi-software-cloud-1300349273/articles/pledged-supplementary-lending/",
        num: 9
    }, {
        title: "房价涨幅多少合适？",
        href: "cloud://diandi-software-cloud.6469-diandi-software-cloud-1300349273/articles/increasement/",
        num: 7
    }]
}, {
    subject: "Stock",
    articles: [{
        title: "什么是商誉减值？",
        href: "cloud://diandi-software-cloud.6469-diandi-software-cloud-1300349273/articles/GoodWill/",
        num: 8
    }, {
        title: "如何避开股权质押这颗雷？",
        href: "cloud://diandi-software-cloud.6469-diandi-software-cloud-1300349273/articles/pledge-of-stock-right/",
        num: 12
    }]
}, {
    subject: "Methodology",
    articles: [{
        title: "如何测算市场规模？",
        href: "cloud://diandi-software-cloud.6469-diandi-software-cloud-1300349273/articles/Methodology/MarketSize/",
        num: 11
    }, {
        title: "如何筛选财经资讯？",
        href: "cloud://diandi-software-cloud.6469-diandi-software-cloud-1300349273/articles/Methodology/FinancialInformation/",
        num: 11
    }, {
        title: "如何找到你想要的数据？",
        href: "cloud://diandi-software-cloud.6469-diandi-software-cloud-1300349273/articles/Methodology/Data/",
        num: 10
    }, {
        title: "如何避免做无用功？",
        href: "cloud://diandi-software-cloud.6469-diandi-software-cloud-1300349273/articles/Methodology/Efficiency/",
        num: 8
    }, {
        title: "如何让你的思考更结构化？",
        href: "cloud://diandi-software-cloud.6469-diandi-software-cloud-1300349273/articles/Methodology/Structure/",
        num: 10
    }, {
        title: "如何克服选择困难症？",
        href: "cloud://diandi-software-cloud.6469-diandi-software-cloud-1300349273/articles/Methodology/Choice/",
        num: 10
    }]
}, {
    subject: "Case",
    articles: [{
        title: "水泥",
        href: "cloud://diandi-software-cloud.6469-diandi-software-cloud-1300349273/articles/Case/Cement/",
        num: 8
    }, {
        title: "调味品",
        href: "cloud://diandi-software-cloud.6469-diandi-software-cloud-1300349273/articles/Case/Condiment/",
        num: 11
    }, {
        title: "食品饮料",
        href: "cloud://diandi-software-cloud.6469-diandi-software-cloud-1300349273/articles/Case/Food/",
        num: 13
    }, {
        title: "殡葬",
        href: "cloud://diandi-software-cloud.6469-diandi-software-cloud-1300349273/articles/Case/Funeral/",
        num: 12
    }, {
        title: "酒店",
        href: "cloud://diandi-software-cloud.6469-diandi-software-cloud-1300349273/articles/Case/Hotel/",
        num: 10
    }, {
        title: "白酒",
        href: "cloud://diandi-software-cloud.6469-diandi-software-cloud-1300349273/articles/Case/Liquor/",
        num: 10
    }, {
        title: "化妆品",
        href: "cloud://diandi-software-cloud.6469-diandi-software-cloud-1300349273/articles/Case/Makeup/",
        num: 12
    }, {
        title: "新能源汽车",
        href: "cloud://diandi-software-cloud.6469-diandi-software-cloud-1300349273/articles/Case/NewEnergyVehicles/",
        num: 11
    }, {
        title: "眼科",
        href: "cloud://diandi-software-cloud.6469-diandi-software-cloud-1300349273/articles/Case/Ophthalmology/",
        num: 11
    }, {
        title: "房产经纪",
        href: "cloud://diandi-software-cloud.6469-diandi-software-cloud-1300349273/articles/Case/PropertyAgent/",
        num: 12
    }, {
        title: "在线教育",
        href: "cloud://diandi-software-cloud.6469-diandi-software-cloud-1300349273/articles/Case/OnlineEducation/",
        num: 13
    }, {
        title: "蚂蚁金服",
        href: "cloud://diandi-software-cloud.6469-diandi-software-cloud-1300349273/articles/Case/AntFinancialServices/",
        num: 9
    }, {
        title: "完美日记",
        href: "cloud://diandi-software-cloud.6469-diandi-software-cloud-1300349273/articles/Case/PerfectDiary/",
        num: 10
    }, {
        title: "蛋壳公寓",
        href: "cloud://diandi-software-cloud.6469-diandi-software-cloud-1300349273/articles/Case/PhoenixTreeHoldings/",
        num: 9
    }, {
        title: "泡泡玛特",
        href: "cloud://diandi-software-cloud.6469-diandi-software-cloud-1300349273/articles/Case/PopMart/",
        num: 10
    }]
}];

module.exports = {
    HIERARCHY
}