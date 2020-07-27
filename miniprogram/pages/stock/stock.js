// pages/stock/stock.js
const MOMENT = require('../../lib/moment.min.js')
const app = getApp()

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

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
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
        // this.getStockNote(options.code)
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function() {

    },

    /**
     *  关注事件
     */
    onFollowTap: function(e) {
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
     *  交易日记
     */
    onNoteTap: function(e) {
        wx.navigateTo({
            url: '/pages/stock/note/note?code=' + this.data.stock.code,
        })
    },

    /**
     *  开始评分
     */
    onCommentTap: function(e) {
        wx.navigateTo({
            url: '/pages/stock/principle/principle?code=' + this.data.stock.code,
        })
    },

    /**
     *  交易日记详情
     */
    onNoteCellTap: function(e) {
        wx.navigateTo({
            url: '/pages/stock/note/note?code=' + this.data.stock.code + '&_id=' + e.currentTarget.dataset._id,
        })
    },

    /**
     *  更新上市公司的财务数据
     */
    onRefreshCellTap: function(e) {
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
     *  对比公司代码输入框
     */
    onInput: function(e) {
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
     *  获取上市公司的财务数据
     */
    getStockInfo: function(code) {
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
                    //  如果有股权质押，过滤到已解押，并且质押终止日未到期的记录
                    if (stock.pledge) {
                        stock.pledge = stock.pledge.filter(item => {
                            return !!!item.F010D || (!!!item.F011D && MOMENT(item.F010D).isAfter())
                        })
                    }
                    //  计算买入与卖出总分
                    if (stock.principle) {
                        stock.principle.map(item => {
                            buy += parseInt(item.buy || 0) * parseInt(item.reliability || 100) / 100
                            sell += parseInt(item.sell || 0) * parseInt(item.reliability || 100) / 100
                        })
                    }

                    if (stock.change) {
                        stock.change = stock.change.filter(item => {
                            return item.F004V && (item.F004V === '董事')
                        })
                    }

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

    getStockNote: function(code) {
        app.wxp.cloud.callFunction({
                name: 'search',
                data: {
                    action: 'note',
                    data: encodeURIComponent(JSON.stringify({
                        code: code
                    }))
                }
            })
            .then(res => {
                console.log('getStockNote >>> ', res)
                if (res.result.data && res.result.data.length > 0) {
                    this.setData({
                        notes: res.result.data.map(item => {
                            item.addTime = MOMENT(item.addTime).format('YYYY-MM-DD HH:mm')
                            return item
                        })
                    })
                }
            })
            .catch(err => {
                console.error(err)
            })
    }
})