// pages/stock/index/index.js
const app = getApp()
const wxcharts = require('../../../lib/wxcharts.js');
import MOMENT from '../../../lib/moment.min.js'

Page({

    /**
     * 页面的初始数据
     */
    data: {
        peerCode: '',
        stock: {},
        buy: 0,
        sell: 0,
        notes: []
    },

    key: 'OPTIONAL',

    canvases: [{
        index: 0,
        id: "EmployeeDegreeRing",
        name: "学位",
        field: ["F003N", "F004N", "F005N", "F007N", "F008N"],
        state: ["博士", "硕士", "本科", "大专", "高中及以下"],
    }, {
        index: 1,
        id: "EmployeeTypeRing",
        name: "工种",
        field: ["F009N", "F010N", "F011N", "F012N", "F013N", "F014N"],
        state: ["生产", "销售", "技术", "财务", "行政", "其他"]
    }, {
        index: 2,
        id: "CapitalStructureRing",
        name: "股本",
        field: ["F021N", "F028N"],
        state: ["已流通股份", "流通受限股份"]
    }, {
        index: 3,
        id: "HKCapitalStructurePie",
        name: "股本",
        field: ["F003N", "F001N", "F002N"],
        state: ["流通股份", "受限股份", "未发行股份"]
    }],

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        console.log(options)
        const storage = wx.getStorageSync(this.key)
        if (storage) {
            const stock = storage.find(item => {
                return item.optional === options.code
            })
            if (stock && stock.peer) {
                this.setData({
                    peerCode: stock.peer
                })
            }
        }

        this.getStockInfo(options.code)
    },

    /**
     *  关注事件
     */
    onFollowTap: function (e) {
        console.log(e)
        app.wxp.cloud.callFunction({
            name: 'finance',
            data: {
                action: 'optional',
                data: encodeURIComponent(JSON.stringify({
                    code: this.data.stock.code,
                    follow: !!!this.data.stock.follow
                }))
            }
        })
            .then(res => {
                console.log(res)
                if (res.result && res.result.stats.updated === 1) {
                    wx.showToast({
                        icon: 'none',
                        title: !!!this.data.stock.follow ? '关注成功' : '取消关注'
                    })
                    this.setData({
                        "stock.follow": !!!this.data.stock.follow
                    })
                }
            })
            .catch(err => {
                console.error(err)
            })
    },

    /**
     *  开始评分
     */
    onCommentTap: function (e) {
        wx.navigateTo({
            url: '/pages/stock/principle/principle?code=' + this.data.stock.code + '&market=' + this.data.stock.market,
        })
    },

    /**
     *  更新上市公司的财务数据
     */
    onSyncCellTap: function (e) {
        console.log(e)
        if (!this.data.stock.code) {
            return
        }

        app.wxp.showLoading()
        app.wxp.cloud.callFunction({
            name: 'finance',
            data: {
                action: e.currentTarget.dataset.op,
                data: encodeURIComponent(JSON.stringify({
                    market: this.data.stock.market,
                    code: this.data.stock.code
                }))
            }
        })
            .then(res => {
                app.wxp.hideLoading()
                console.log(res)
                this.getStockInfo(this.data.stock.code)
            })
            .catch(err => {
                app.wxp.hideLoading()
                console.error(err)
            })
    },

    /**
     *  阅读上市公司财务报表
     */
    onBasicCellTap: function (e) {
        console.log(e)
        if (!this.data.stock.code) {
            return
        }

        wx.navigateTo({
            url: e.currentTarget.dataset.prefix + this.data.stock.code,
        })
    },

    /**
     *  对比公司代码输入框
     */
    onInput: function (e) {
        const data = {
            optional: this.data.stock.code,
            peer: e.detail.value
        }

        try {
            const storage = wx.getStorageSync(this.key)
            if (storage) {
                if (storage.some(item => {
                    return item.optional === this.data.stock.code
                })) {
                    wx.setStorageSync(
                        this.key, storage.map(item => {
                            if (item.optional === this.data.stock.code) {
                                item.peer = e.detail.value
                            }
                            return item
                        })
                    )
                } else {
                    storage.push(data)
                    wx.setStorageSync(
                        this.key, storage
                    )
                }
            } else {
                wx.setStorageSync(
                    this.key, [data]
                )
            }
        } catch (err) {
            console.error(err)
        }
    },

    /**
     *  画布触碰事件响应
     */
    onCanvasTouched: function (e) {
        // console.log(e)
        const target = this.canvases.find(item => {
            return item.id === e.target.dataset.id
        })
        // console.log(target)

        target.handler.showToolTip(e, {
            format: function (item, category) {
                console.log(item, category)
                return item.name + '：' + item.data
            }
        });
    },

    /**
     *  获取上市公司的财务数据
     */
    getStockInfo: function (code) {
        app.wxp.cloud.callFunction({
            name: 'search',
            data: {
                action: 'stock',
                data: encodeURIComponent(JSON.stringify({
                    keyword: code
                }))
            }
        })
            .then(res => {
                console.log('getStockInfo >>> ', res)
                if (res.result && res.result.list.length > 0) {
                    let buy = 0,
                        sell = 0;
                    const stock = res.result.list[0]

                    //  计算买入与卖出总分
                    if (stock.principle) {
                        stock.principle.map(item => {
                            buy += parseInt(item.buy || 0) * parseInt(item.reliability || 100) / 100
                            sell += parseInt(item.sell || 0) * parseInt(item.reliability || 100) / 100
                        })
                    }

                    //  公司概况
                    if (stock.employee) {
                        this.createRingChart(0, stock.employee[0])     //  雇员学历占比
                        this.createRingChart(1, stock.employee[0])     //  雇员工种占比
                    }

                    //  股本结构
                    if (stock.capital) {
                        if (stock.market === 'HK') {
                            this.createPieChart(3, stock.capital[0])        //  香港
                        } else {
                            this.createRingChart(2, stock.capital[0])       //  沪深
                        }
                    }

                    //  过滤掉企业名称为空，或者状态为注销的对外投资
                    if (stock.invest) {
                        stock.invest = stock.invest.filter(item => {
                            return item.F001V && (item.F001V !== '') && (item.F007V !== '注销')
                        })
                    }

                    //  过滤掉内容为空的行政许可
                    if (stock.license) {
                        stock.license = stock.license.filter(item => {
                            return item.F001V && (item.F001V !== '')
                        })
                    }

                    //  过滤掉不分红不转赠的方案
                    if (stock.dividends) {
                        if (stock.market === 'HK') {
                            stock.dividends = stock.dividends.filter(item => {
                                return item.F004V && (item.F004V !== '无派息')
                            })
                        } else {
                            stock.dividends = stock.dividends.filter(item => {
                                return item.F007V && (item.F007V !== '')
                            })
                        }
                    }

                    //  导航栏标题
                    wx.setNavigationBarTitle({
                        title: stock.name
                    })

                    this.setData({
                        stock,
                        buy,
                        sell
                    })
                }
            })
            .catch(err => {
                console.error(err)
            })
    },

    //  创建环形图
    createRingChart: function (index, data) {
        const series = []

        for (let i = 0; i < this.canvases[index].field.length; i++) {
            if (data[this.canvases[index].field[i]]) {
                series.push({
                    name: this.canvases[index].state[i],
                    data: data[this.canvases[index].field[i]]
                })
            }
        }

        if (series.length > 0) {
            this.canvases[index].handler = new wxcharts({
                canvasId: this.canvases[index].id,
                type: 'ring',
                title: {
                    name: this.canvases[index].name,
                    fontSize: 11
                },
                series: series,
                width: app.windowWidth,
                height: app.windowHeight,
                dataLabel: true,
                animation: false
            });
        }
    },

    //  创建饼图
    createPieChart: function (index, data) {
        const series = []

        for (let i = this.canvases[index].field.length - 1; i >= 0; i--) {
            if (data[this.canvases[index].field[i]]) {
                series.push({
                    name: this.canvases[index].state[i],
                    data: i > 0 ? data[this.canvases[index].field[i]] - data[this.canvases[index].field[i - 1]] : data[this.canvases[index].field[i]]
                })
            }
        }
        console.log(series)

        if (series.length > 0) {
            this.canvases[index].handler = new wxcharts({
                canvasId: this.canvases[index].id,
                type: 'pie',
                title: {
                    name: this.canvases[index].name,
                    fontSize: 11
                },
                series: series,
                width: app.windowWidth,
                height: app.windowHeight,
                dataLabel: true,
                animation: false
            });
        }
    }

})