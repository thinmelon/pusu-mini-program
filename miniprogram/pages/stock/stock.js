// pages/stock/stock.js
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
        // this.getStockNote(options.code)
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
    }

})