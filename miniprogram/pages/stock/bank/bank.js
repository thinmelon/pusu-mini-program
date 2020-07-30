// miniprogram/pages/stock/bank/bank.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        stock: {},
        buy: 0,
        sell: 0
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

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


})