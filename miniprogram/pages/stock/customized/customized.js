// pages/stock/customized/customized.js
const app = getApp()
const wxcharts = require('../../../lib/wxcharts.js');

Page({

    /**
     * 页面的初始数据
     */
    data: {
        indicators: []
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.getStockInfo(options.code)
    },

    /**
     *  图表提示事件响应
     */
    onCanvasTouched: function (e) {
        // console.log(e)
        const target = this.data.indicators.find(indicator => {
            return indicator.id === e.target.dataset.id
        })
        console.log(target)

        target.handler.showToolTip(e, {
            format: function (item, category) {
                const content = '[' + category + '] ' + item.name + ': ' + item.data + target.unit
                return content
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
                    keyword: code,
                    field: {
                        "name": "$name",
                        "customized": "$customized"
                    }
                }))
            }
        })
            .then(res => {
                console.log('getStockInfo >>> ', res)
                if (res.result && res.result.list.length > 0 && res.result.list[0].customized) {
                    const stock = res.result.list[0]
                    stock.customized = stock.customized.map(indicator => {
                        let series = [];
                        //  整理数据
                        for (let i = 0, length = indicator.fields.length; i < length; i++) {
                            let axisY = indicator.Y.filter((value, index) => {
                                return index % length === i ? 1 : 0;
                            })
                            if (indicator.divisor) {
                                axisY = axisY.map(item => {
                                    item = (item / indicator.divisor).toFixed(1)
                                    return item;
                                })
                            }
                            series.push({
                                name: indicator.fields[i],
                                data: axisY
                            })
                        }
                        //  绘制图表
                        indicator.handler = new wxcharts({
                            canvasId: indicator.id,
                            type: indicator.type,
                            categories: indicator.X,
                            series: series,
                            xAxis: {
                                disableGrid: true
                            },
                            yAxis: {
                                min: 0,
                                format: function (val) {
                                    return val + indicator.unit;
                                }
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

                        return indicator
                    })

                    this.setData({
                        "indicators": stock.customized || []
                    })
                    //  设置标题栏名称
                    wx.setNavigationBarTitle({
                        title: stock.name
                    })
                }
            })
    }
})