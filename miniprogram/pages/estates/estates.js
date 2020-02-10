// pages/estates/estates.js
const MOMENT = require('../../lib/moment.min.js');
const wxcharts = require('../../lib/wxcharts.js');
const app = getApp()

Page({

    /**
     * 页面的初始数据
     */
    data: {
        navigationBarTitleText: "莆田房产",
        navbarHeight: 0, //  导航栏高度
        navbarTop: 0, //  导航栏上边距
        navbarButtons: [{ //  导航栏按钮
                index: 0,
                name: '搜索',
                icon: 'cloud://diandi-software-cloud.6469-diandi-software-cloud-1300349273/search.png',
                url: '/pages/estates/search/search'
            },
            {
                index: 1,
                name: '地图',
                icon: 'cloud://diandi-software-cloud.6469-diandi-software-cloud-1300349273/map.png',
                url: '/pages/estates/map/map'
            }
        ],

        districts: [{
            id: "chengxiang",
            name: "城厢",
            today: null
        }, {
            id: "licheng",
            name: "荔城",
            today: null
        }, {
            id: "hanjiang",
            name: "涵江",
            today: null
        }, {
            id: "xiuyu",
            name: "秀屿",
            today: null
        }],

        /*	 	知识点      */
        articles: {
            "Estates": ["什么是交易方程式？", "什么是通货紧缩？", "央行是怎么印钱的？", "利率的本质是什么？", "央行的货币政策工具有哪些？", "什么是棚改货币化？", "房价涨幅多少合适？"]
        }
    },

    lineCanvases: [{
            _id: "historyAvailableNumberHousing",
            value: "availableNumberHousing",
            name: "可售住宅数量走势",
            unit: "套",
            handler: null
        }, {
            _id: "historySoldNumberHousing",
            value: "soldNumberHousing",
            name: "已售住宅数量走势",
            unit: "套",
            handler: null
        },
        // {
        //     _id: "averagePriceHousing",
        //     value: "averagePriceHousing",
        //     name: "住宅成交均价走势",
        //     unit: "元",
        //     handler: null
        // }, {
        //     _id: "averagePriceGarage",
        //     value: "averagePriceGarage",
        //     name: "车库成交均价走势",
        //     unit: "元",
        //     handler: null
        // }, {
        //     _id: "averagePriceBusiness",
        //     value: "averagePriceBusiness",
        //     name: "商业成交均价走势",
        //     unit: "元",
        //     handler: null
        // }, {
        //     _id: "averagePriceOffice",
        //     value: "averagePriceOffice",
        //     name: "写字楼成交均价走势",
        //     unit: "元",
        //     handler: null
        // }
    ],

    ringCanvases: [{
            _id: "availableNumberHousing",
            value: "availableNumberHousing",
            name: "可售住宅数量",
            handler: null
        },
        // {
        //     _id: "availableAreaHousing",
        //     value: "availableAreaHousing",
        //     name: "可售住宅面积",
        //     handler: null
        // }, 
        {
            _id: "soldNumberHousing",
            value: "soldNumberHousing",
            name: "已售住宅数量",
            handler: null
        },
        // {
        //     _id: "soldAreaHousing",
        //     value: "soldAreaHousing",
        //     name: "已售住宅面积",
        //     handler: null
        // }
    ],

    areaCanvases: [{
        _id: "houseConstructionArea",
        value: "houseConstructionArea",
        name: "住宅开发面积",
        subIndex: [{
            name: "住宅施工面积",
            value: "houseConstructionArea",
            unit: "万平方米"
        }, {
            name: "住宅竣工面积",
            value: "houseCompletedArea",
            unit: ""
        }],
        handler: null
    }, {
        _id: "houseSaleArea",
        value: "houseSaleArea",
        name: "住宅销售面积",
        subIndex: [{
            name: "住宅销售面积",
            value: "houseSaleArea",
            unit: "万平方米"
        }, {
            name: "住宅待售面积",
            value: "houseToBeSoldArea",
            unit: ""
        }],
        handler: null
    }, {
        _id: "landAcquisitionArea",
        value: "landAcquisitionArea",
        name: "土地购置面积",
        subIndex: [{
            name: "土地购置面积",
            value: "landAcquisitionArea",
            unit: "万平方米"
        }],
        handler: null
    }, {
        _id: "realEstateInvestment",
        value: "realEstateInvestment",
        name: "开发投资完成额",
        subIndex: [{
            name: "开发投资完成额",
            value: "realEstateInvestment",
            unit: "亿元"
        }],
        handler: null
    }],

    contractCanvas: [{
        _id: "housingConstractNumber",
        value: "housingConstractNumber",
        name: "商品房签约统计",
        unit: "套",
        subIndex: [{
            name: "总数",
            value: "dayTotalContract"
        }, {
            name: "住宅",
            value: "dayHousingContract"
        }],
        handler: null
    }],

    populationCanvas: [{
        _id: "genderResidentPopulation",
        value: "genderResidentPopulation",
        name: "常住人口走势",
        unit: "万人",
        subIndex: [{
            name: "常住总人口",
            value: "resident"
        }, {
            name: "（男）",
            value: "residentMale"
        }, {
            name: "（女）",
            value: "residentFemale"
        }],
        handler: null
    }, {
        _id: "regionalResidentPopulation",
        value: "regionalResidentPopulation",
        name: "区域常住人口",
        unit: "万人",
        subIndex: [{
            name: "城市",
            value: "residentTown"
        }, {
            name: "农村",
            value: "residentCountry"
        }],
        handler: null
    }, {
        _id: "birthRate",
        value: "birthRate",
        name: "出生率",
        unit: "%",
        subIndex: [{
            name: "出生率",
            value: "birthRate"
        }, {
            name: "死亡率",
            value: "deathRate"
        }],
        handler: null
    }],

    rateCanvas: [{
        _id: "loanPrimeRate",
        value: "loanPrimeRate",
        name: "贷款市场报价利率",
        unit: "",
        subIndex: [{
            name: "1年期",
            value: "oneYearLpr"
        }, {
            name: "5年期",
            value: "fiveYearLpr"
        }],
        handler: null
    }, {
        _id: "mortgageRate",
        value: "mortgageRate",
        name: "房贷利率趋势",
        unit: "",
        subIndex: [{
            name: "首套平均利率",
            value: "firstAverageRate"
        }, {
            name: "二套平均利率",
            value: "secondAverageRate"
        }, {
            name: "同期基准利率",
            value: "staticAverageRate"
        }],
        handler: null
    }],

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        try {
            /** 获取菜单按钮（右上角胶囊按钮）的布局位置信息。坐标信息以屏幕左上角为原点 */
            const menuButtonObject = wx.getMenuButtonBoundingClientRect()
            const systemInfo = wx.getSystemInfoSync()
            this.setData({
                navbarHeight: systemInfo.statusBarHeight + menuButtonObject.height + (menuButtonObject.top - systemInfo.statusBarHeight) * 2,
                navbarTop: menuButtonObject.top
            })
        } catch (e) {
            console.error('获取设备系统信息失败 >>> ', e);
        }

        this.getEstatesMarket()
        this.getResidentPopulation() //  长期看人口需求
        this.getEstatesInvestment() //  中期看土地供应
        this.getMortgageRate() //  短期看金融

    },

    onMoreIndexTap: function() {
        wx.navigateTo({
            url: "/pages/index/index"
        })
    },

    /**
     *  知识点点击事件
     */
    onCellTap: function(e) {
        console.log(e)
        wx.navigateTo({
            url: '/pages/knowledge/knowledge?subject=' + e.currentTarget.dataset.subject + "&title=" + e.currentTarget.dataset.title,
        })
    },

    /**
     *      获取房地产市场统计数据
     */
    getEstatesMarket: function() {
        app.wxp.cloud.callFunction({
                name: 'finance',
                data: {
                    action: 'history'
                }
            })
            .then(res => {
                console.log(res)
                if (res.result.list && res.result.list.length > 0) {
                    //  创建成交均价，可售、已售趋势图
                    this.createContractCanvas(res.result.list)
                    //  创建成交均价，可售、已售趋势图
                    this.createLineChart(res.result.list)
                    //  取昨天的数据
                    const target = res.result.list.find(item => {
                        return item.day.date === MOMENT().subtract(1, 'days').format('YYYY-MM-DD')
                    })
                    //  创建昨天可售、已售住宅数量各县区占比的环形图
                    if (target && target.day) {
                        this.createRingChart(target.day)
                        this.setData({
                            districts: this.data.districts.map(district => {
                                target.day[district.id].averagePriceBusiness = parseInt(target.day[district.id].averagePriceBusiness)
                                target.day[district.id].averagePriceGarage = parseInt(target.day[district.id].averagePriceGarage)
                                target.day[district.id].averagePriceHousing = parseInt(target.day[district.id].averagePriceHousing)
                                target.day[district.id].averagePriceOffice = parseInt(target.day[district.id].averagePriceOffice)
                                target.day[district.id].averagePriceOther = parseInt(target.day[district.id].averagePriceOther)
                                district.today = target.day[district.id]
                                return district
                            })
                        })
                    }
                }
            })
            .catch(err => {
                console.error(err)
            })
    },

    getEstatesInvestment: function() {
        app.wxp.cloud.callFunction({
                name: 'finance',
                data: {
                    action: 'investment'
                }
            })
            .then(res => {
                console.log(res)
                this.createAreaChart(res.result.data)
            })
            .catch(err => {
                console.error(err)
            })
    },

    getResidentPopulation: function() {
        app.wxp.cloud.callFunction({
                name: 'finance',
                data: {
                    action: 'population'
                }
            })
            .then(res => {
                console.log(res)
                if (res.result.data && res.result.data.length > 0) {
                    this.createPopulationChart(res.result.data)
                }
            })
            .catch(err => {
                console.error(err)
            })
    },

    getMortgageRate: function() {
        app.wxp.cloud.callFunction({
                name: 'finance',
                data: {
                    action: 'money'
                }
            })
            .then(res => {
                console.log(res)
                if (res.result.data && res.result.data.length > 0) {
                    this.createRateChart(res.result.data)
                }
            })
            .catch(err => {
                console.error(err)
            })
    },

    /**
     *  点击显示详情处理逻辑
     */
    canvasTouchHandler: function(e) {
        const target = this[e.target.dataset.category].find(canvas => {
            return canvas._id === e.target.dataset.id
        })
        // console.log(target)

        target.handler.showToolTip(e, {
            // background: '#7cb5ec',
            format: function(item, category) {
                // console.log(item, category)
                return '[' + category + ']' + item.name + ': ' + item.data + target.unit
            }
        });
    },

    /**
     *  创建线形图表
     */
    createLineChart: function(target) {
        this.lineCanvases = this.lineCanvases.map(canvas => {
            const categories = [];
            const series = [];

            /** X坐标数据源 */
            target.map(item => {
                categories.push(item.day.date);
            })
            /** Y坐标数据源 */
            this.data.districts.map(district => {
                series.push({
                    name: district.name,
                    data: target.map(item => {
                        return item.day[district.id] ? parseInt(item.day[district.id][canvas.value]) : 0
                    }),
                    format: function(val, name) {
                        return val;
                    }
                })
            })

            /** 绘制图表 */
            canvas.handler = new wxcharts({
                canvasId: canvas._id,
                type: 'line',
                categories: categories,
                series: series,
                xAxis: {
                    disableGrid: true
                },
                yAxis: {
                    min: 0
                },
                animation: false,
                width: app.windowWidth,
                height: app.windowHeight,
                dataLabel: false,
                dataPointShape: false,
                extra: {
                    lineStyle: 'curve'
                }
            });

            return canvas
        });
    },

    /**
     *  创建环形图表
     */
    createRingChart: function(target) {
        this.ringCanvases = this.ringCanvases.map(canvas => {
            let series = []

            this.data.districts.map(district => {
                series.push({
                    name: target[district.id]._id,
                    data: target[district.id][canvas.value]
                })
            })

            canvas.handler = new wxcharts({
                canvasId: canvas._id,
                type: 'ring',
                title: {
                    name: canvas.name,
                    fontSize: 11
                },
                series: series,
                width: app.windowWidth,
                height: app.windowHeight,
                dataLabel: true,
                animation: false
            });

            return canvas
        })

    },

    /**
     *  创建柱形图表
     */
    createAreaChart: function(target) {
        this.areaCanvases = this.areaCanvases.map(canvas => {
            const categories = target.map(item => {
                return item._id
            });
            const series = canvas.subIndex.map(sub => {
                return {
                    name: sub.name,
                    data: target.map(item => {
                        return item[sub.value] || 0
                    }),
                    format: function(val) {
                        return val.toFixed(2) + sub.unit;
                    }
                }
            })

            canvas.handler = new wxcharts({
                canvasId: canvas._id,
                type: 'area',
                categories: categories,
                series: series,
                yAxis: {
                    format: function(val) {
                        return val;
                    }
                },
                width: app.windowWidth,
                height: app.windowHeight,
                animation: false
            });
        });
    },

    createContractCanvas: function(target) {
        this.contractCanvas = this.contractCanvas.map(canvas => {
            const categories = [];
            const series = [];

            /** X坐标数据源 */
            target.map(item => {
                categories.push(item.day.date);
            })
            /** Y坐标数据源 */
            canvas.subIndex.map(field => {
                series.push({
                    name: field.name,
                    data: target.map(item => {
                        return item.day[field.value] || 0
                    }),
                    format: function(val, name) {
                        return val;
                    }
                })
            })
            // console.log(series)

            /** 绘制图表 */
            canvas.handler = new wxcharts({
                canvasId: canvas._id,
                type: 'line',
                categories: categories,
                series: series,
                xAxis: {
                    disableGrid: true
                },
                yAxis: {
                    min: 0
                },
                animation: false,
                width: app.windowWidth,
                height: app.windowHeight,
                dataLabel: false,
                dataPointShape: false,
                extra: {
                    lineStyle: 'curve'
                }
            });

            return canvas
        });
    },

    /**
     *      人口
     */
    createPopulationChart: function(target) {
        this.populationCanvas = this.populationCanvas.map(canvas => {
            const categories = [];
            const series = [];

            /** X坐标数据源 */
            target.map(item => {
                categories.push(item.year);
            })
            /** Y坐标数据源 */
            canvas.subIndex.map(field => {
                series.push({
                    name: field.name,
                    data: target.map(item => {
                        return item[field.value]
                    }),
                    format: function(val, name) {
                        return val;
                    }
                })
            })

            /** 绘制图表 */
            canvas.handler = new wxcharts({
                canvasId: canvas._id,
                type: 'line',
                categories: categories,
                series: series,
                xAxis: {
                    disableGrid: true
                },
                yAxis: {
                    min: 0
                },
                animation: false,
                width: app.windowWidth,
                height: app.windowHeight,
                dataLabel: false,
                dataPointShape: false,
                extra: {
                    lineStyle: 'curve'
                }
            });

            return canvas
        });
    },

    /**
     *      房货利率
     */
    createRateChart: function(target) {
        this.rateCanvas = this.rateCanvas.map(canvas => {
            const categories = [];
            const series = [];

            /** X坐标数据源 */
            target.map(item => {
                categories.push(item._id);
            })
            /** Y坐标数据源 */
            canvas.subIndex.map(field => {
                series.push({
                    name: field.name,
                    data: target.map(item => {
                        return item[field.value] || 0
                    }),
                    format: function(val, name) {
                        return val;
                    }
                })
            })

            /** 绘制图表 */
            canvas.handler = new wxcharts({
                canvasId: canvas._id,
                type: 'line',
                categories: categories,
                series: series,
                xAxis: {
                    disableGrid: true
                },
                yAxis: {
                    min: 0
                },
                animation: false,
                width: app.windowWidth,
                height: app.windowHeight,
                dataLabel: false,
                dataPointShape: false,
                extra: {
                    lineStyle: 'curve'
                }
            });

            return canvas
        });
    }

})