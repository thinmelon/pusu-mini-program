// miniprogram/pages/commodity/commodity.js
const wxcharts = require('../../lib/wxcharts.js');
const app = getApp()

Page({

    /**
     * 页面的初始数据
     */
    data: {

    },

    lineCanvases: [{
        _id: "mobile",
        unit: "%",
        handler: null
    }, {
        _id: "tv",
        unit: "%",
        handler: null
    }, {
        _id: "car",
        unit: "%",
        handler: null
    }, {
        _id: "cement",
        unit: "%",
        handler: null
    }, {
        _id: "integratedCircuit",
        unit: "%",
        handler: null
    }, {
        _id: "baseStation",
        unit: "%",
        handler: null
    }],

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.getAllProductsIndexes()
    },

    /**
     *  点击显示详情处理逻辑
     */
    onCanvasTouched: function (e) {
        const target = this[e.target.dataset.category].find(canvas => {
            return canvas._id === e.target.dataset.id
        })
        // console.log(target)

        target.handler.showToolTip(e, {
            // background: '#7cb5ec',
            format: function (item, category) {
                // console.log(item)
                return '[' + category + ']  ' + item.name + ':' + item.data + target.unit
            }
        });
    },

    /**
     *  获取所有工业主要产品指标
     */
    getAllProductsIndexes: function () {
        app.wxp.cloud.callFunction({
                name: "database",
                data: {
                    collection: "_products",
                    limit: 60,
                    sort1: "_id",
                    sortOption1: "desc"
                }
            })
            .then(res => {
                console.log(res);

                if (res.result && res.result.data.length > 0) {
                    const rawData = res.result.data.reverse()
                    const series = [{
                        name: "mobile",
                        data: [],
                        subIndex: [{
                            name: "本月同比",
                            value: "mobileMonthlyYearToYear"
                        }, {
                            name: "本年累计同比",
                            value: "mobileGrandYearToYear"
                        }]
                    }, {
                        name: "tv",
                        data: [],
                        subIndex: [{
                            name: "本月同比",
                            value: "tvMonthlyYearToYear"
                        }, {
                            name: "本年累计同比",
                            value: "tvGrandYearToYear"
                        }]
                    }, {
                        name: "car",
                        data: [],
                        subIndex: [{
                            name: "本月同比",
                            value: "carMonthlyYearToYear"
                        }, {
                            name: "本年累计同比",
                            value: "carGrandYearToYear"
                        }]
                    }, {
                        name: "cement",
                        data: [],
                        subIndex: [{
                            name: "本月同比",
                            value: "cementMonthlyYearToYear"
                        }, {
                            name: "本年累计同比",
                            value: "cementGrandYearToYear"
                        }]
                    }, {
                        name: "integratedCircuit",
                        data: [],
                        subIndex: [{
                            name: "本月同比",
                            value: "integratedCircuitMonthlyYearToYear"
                        }, {
                            name: "本年累计同比",
                            value: "integratedCircuitGrandYearToYear"
                        }]
                    }, {
                        name: "baseStation",
                        data: [],
                        subIndex: [{
                            name: "本月同比",
                            value: "baseStationMonthlyYearToYear"
                        }, {
                            name: "本年累计同比",
                            value: "baseStationGrandYearToYear"
                        }]
                    }];
                    const date = [];

                    //  日期    X轴
                    rawData.map(item => {
                        date.push(item._id)
                    })

                    //  各工业主要产品指标  Y轴
                    for (let i = 0, length = series.length; i < length; i++) {
                        //  各项子指标
                        series[i].subIndex.map(field => {
                            series[i].data.push({
                                name: field.name,
                                data: rawData.map(item => {
                                    return item[field.value] ? item[field.value] : 0
                                }),
                                format: function (val, name) {
                                    return val;
                                }
                            })
                        })
                        //  绘制图形
                        this.createLineCanvas(series[i].name, date, series[i].data)
                    }
                }
            });
    },

    /**
     *  绘制图表
     */
    createLineCanvas: function (_id, categories, series) {
        this.lineCanvases = this.lineCanvases.map(canvas => {
            if (canvas._id === _id) {
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
            }

            return canvas
        });
    },

})