// pages/stock/pannel.js
const economic = require('../../services/economic.service.js');

Page({

    /**
     * 页面的初始数据
     */
    data: {
        markets: [],
        CHStock: [{
            name: '铭普光磁',
            code: '002902'
        }, {
            name: '*ST凡谷',
            code: '002194'
        }, {
            name: '光迅科技',
            code: '002281'
        }, {
            name: '通宇通讯',
            code: '002792'
        }, {
            name: '深南电路',
            code: '002916'
        }, {
            name: '东山精密',
            code: '002384'
        }, {
            name: '生益科技',
            code: '600183'
        }, {
            name: '景旺电子',
            code: '603228'
        }],
        USStock: [{
            name: '特斯拉',
            code: 'tsla'
        }, {
            name: '蔚来',
            code: 'nio'
        }, {
            name: '阿里巴巴',
            code: 'baba'
        }, {
            name: '京东',
            code: 'jd'
        }, {
            name: '百度',
            code: 'bidu'
        }],
        HKStock: [{
            name: '京信通信',
            code: '02342'
        }, {
            name: '摩比发展',
            code: '00947'
        }, {
            name: '小米集团-W',
            code: '01810'
        }, {
            name: '中国有赞',
            code: '08083'
        }],
        searchResult: []
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        this.setData({
            markets: getApp().markets
        });
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function() {
        this.paintStockMarket();
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function() {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function() {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function() {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function() {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function() {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function() {

    },

    /**
     * 	获取A股基本面数据，如PE、PB等
     */
    getStockFundmental: function(request) {
        const that = this;
        economic.getStockFundmental(request)
            .then(res => {
                console.log(res);
                if (res.data.code === 0) {
                    this.data.CHStock = this.data.CHStock.map(stock => {
                        for (let i = 0; i < res.data.data.length; i++) {
                            if (stock.code === res.data.data[i].stockCode) {
                                return Object.assign(stock, {
                                    sp: res.data.data[i].sp,
                                    d_pe_ttm: res.data.data[i].d_pe_ttm.toFixed(2),
                                    pb_wo_gw: res.data.data[i].pb_wo_gw.toFixed(2),
                                    ps_ttm: res.data.data[i].ps_ttm.toFixed(2),
                                    pcf_ttm: res.data.data[i].pcf_ttm.toFixed(2),
                                    ey: (res.data.data[i].ey * 100).toFixed(2),
                                    dyr: (res.data.data[i].dyr * 100).toFixed(2),
                                    mc: (res.data.data[i].mc / 100000000).toFixed(2),
                                    cmc: (res.data.data[i].cmc / 100000000).toFixed(2),
                                    smt: res.data.data[i].smt ? (res.data.data[i].smt / 100000000).toFixed(2) : '',
                                    ha_shm: res.data.data[i].ha_shm ? (res.data.data[i].ha_shm / 100000000).toFixed(2) : ''
                                });
                            }
                        } /**	end of for */
                        return stock;
                    }) /**	end of this.data.CHStock.map */
                    this.setData({
                        CHStock: this.data.CHStock
                    })
                }
            })
            .catch(err => {
                console.error(err);
            })
    },

    /**
     * 	获取港股基本面数据，如PE、PB等
     */
    getHKStockFundmental: function(request) {
        const that = this;
        economic.getHKStockFundmental(request)
            .then(res => {
                console.log(res);
                if (res.data.code === 0) {
                    this.data.HKStock = this.data.HKStock.map(stock => {
                        for (let i = 0; i < res.data.data.length; i++) {
                            if (stock.code === res.data.data[i].stockCode) {
                                return Object.assign(stock, {
                                    sp: res.data.data[i].sp,
                                    pe_ttm: res.data.data[i].pe_ttm.toFixed(2),
                                    pb: res.data.data[i].pb.toFixed(2),
                                    ps_ttm: res.data.data[i].ps_ttm.toFixed(2),
                                    pcf_ttm: res.data.data[i].pcf_ttm.toFixed(2),
                                    dyr: (res.data.data[i].dyr * 100).toFixed(2),
                                    mc: (res.data.data[i].mc / 100000000).toFixed(2),
                                    tv: (res.data.data[i].tv / 10000).toFixed(0)
                                });
                            }
                        } /**	end of for */
                        return stock;
                    }) /**	end of this.data.HKStock.map */
                    this.setData({
                        HKStock: this.data.HKStock
                    })
                }
            })
            .catch(err => {
                console.error(err);
            })
    },

    /**
     * 	获取美股基本面数据
     */
    getUSAStockFundmental: function(code) {
        const that = this;

        economic.getUSAStockFundmental(code)
            .then(res => {
                console.log(res);
                if (res.data.error_code === 0) {
                    that.data.USStock = that.data.USStock.map(stock => {
                        for (let i = 0; i < res.data.result.length; i++) {
                            const target = res.data.result[i];
                            if (stock.code.toLowerCase() === target.data.gid.toLowerCase()) {
                                return Object.assign(stock, {
                                    lastestpri: parseFloat(target.data.lastestpri).toFixed(2), //	最新价
                                    formpri: parseFloat(target.data.formpri).toFixed(2), //	前收盘价
                                    openpri: parseFloat(target.data.openpri).toFixed(2), //	开盘价
                                    traAmount: (parseFloat(target.data.traAmount) / 10000).toFixed(0), //	成交量
                                    markValue: (parseFloat(target.data.markValue) / 100000000).toFixed(2), //	市值
                                    capital: (parseFloat(target.data.capital) / 100000000).toFixed(2), //	股本
                                    EPS: target.data.EPS, //	每股收益
                                    ROR: target.data.ROR, //	收益率
                                    priearn: target.data.priearn, //	市盈率
                                    beta: parseFloat(target.data.beta), //	贝塔系数
                                    divident: target.data.divident, //	股息
                                    ustime: target.data.ustime, //	美国当前更新时间
                                    chtime: target.data.chtime, //	中国时间
                                    gopicture: target.gopicture
                                });
                            }
                        } /**	end of for */
                        return stock;
                    }); /**	end of that.data.USStock.map */
                    that.setData({
                        USStock: that.data.USStock
                    })
                }
            })
            .catch(err => {
                console.error(err);
            })
    },

    searchStock: function(keyword) {
        let abbreviation = 'hs';
        this.data.markets.map(market => {
            if (market.enable) {
                abbreviation = market.abbreviation;
            }
        })

        economic.searchStock({
                market: abbreviation,
                keyword: keyword
            })
            .then(res => {
                console.log(res);
                if (res.statusCode === 200) {
                    this.setData({
                        searchResult: res.data
                    })
                } else {
                    //  this.searchStock(keyword);
                }
            })
            .catch(err => {
                console.error(err);
            })
    },

    /**
     *  初始化各股票基础元信息
     */
    initializeStocksFundmental: function(stockArray, metrics, apiFunc) {
        let stockCodes = stockArray.map(stock => {
            return stock.code;
        });
        apiFunc({
            date: 'latest',
            metrics: metrics,
            stockCodes: stockCodes
        });
    },

    /**
     *  绘制股票市场
     */
    paintStockMarket: function() {
        this.data.markets.map(market => {
            if ((market.name === 'A股') && market.enable) {
                this.initializeStocksFundmental(
                    this.data.CHStock, ['d_pe_ttm', 'pb_wo_gw', 'ps_ttm', 'pcf_ttm', 'ey', 'dyr', 'sp', 'mc', 'cmc', 'smt', 'ha_shm'],
                    this.getStockFundmental);
            }
            if ((market.name === '港股') && market.enable) {
                this.initializeStocksFundmental(
                    this.data.HKStock, ['pe_ttm', 'pb', 'ps_ttm', 'pcf_ttm', 'dyr', 'sp', 'mc', 'tv', 'ah_shm'],
                    this.getHKStockFundmental);
            }
            if ((market.name === '美股') && market.enable) {
                for (let i = 0; i < this.data.USStock.length; i++) {
                    this.getUSAStockFundmental(this.data.USStock[i].code);
                }
            }
        })
    },

    /**
     *  点击股票名称
     */
    onStockNameClicked: function(evt) {
        let itemList = [],
            target;

        console.log(evt);
        this.data.markets.map(market => {
            if (market.enable) {
                target = market;
                itemList = market.properties.map(item => {
                    return item.name;
                })
            }
        })
        if (itemList.length > 0) {
            wx.showActionSheet({
                itemList: itemList,
                success(res) {
                    target.properties.map(item => {
                        if (item.tapIndex === res.tapIndex && item.url) {
                            wx.navigateTo({
                                url: item.url + '&code=' + evt.currentTarget.dataset.stock.code + '&title=' + evt.currentTarget.dataset.stock.name
                            })
                        }
                    })
                },
                fail(res) {
                    console.log(res.errMsg)
                }
            })
        }
    },

    /**
     *  选择股票市场
     */
    onMarketClicked: function(evt) {
        this.setData({
            markets: this.data.markets.map(item => {
                item.enable = (item.name === evt.currentTarget.dataset.name) ? true : false;
                return item;
            })
        });
        this.paintStockMarket();
    },

    /**
     *  搜索组件
     *  输入关键词后触发事件
     *  通知页面开始搜索
     */
    onInputKeyword: function(evt) {
        console.log(evt);
        this.searchStock(evt.detail.keyword);
    },

    /**
     *  搜索组件
     *  输入框失去光标后触发事件
     */
    onInputBlur: function(evt) {
        console.log(evt);
        this.setData({
            searchResult: []
        })
    },

    /**
     *  选择搜索结果后加入股票市场的面板中
     */
    onSearchResultClicked: function(evt) {
        console.log(evt);
        let target;
        this.data.markets.map(market => {
            if (market.enable) {
                switch (market.abbreviation) {
                    case 'hs':
                        target = this.data.CHStock;
                        break
                    case 'hk':
                        target = this.data.HKStock;
                        break;
                    case 'usa':
                        target = this.data.USStock;
                        break;
                }
            }
        })

        let isFound = false;
        target.map(item => {
            if (evt.currentTarget.dataset.stock.SECCODE.toLowerCase() === item.code.toLowerCase()) {
                isFound = true;
            }
        })
        if (!isFound) {
            target.unshift({
                name: evt.currentTarget.dataset.stock.SECNAME,
                code: evt.currentTarget.dataset.stock.SECCODE
            })
            this.paintStockMarket();
        }
    }
})