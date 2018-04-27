//index.js
//获取应用实例
const app = getApp()
const wxApiPromise = require('../../utils/wx.api.promise.js');
const economic = require('../../services/economic.service.js');
const chart = require('../../services/chart.service.js');

Page({
    data: {
        canvasWidth: '',
        canvasHeight: '',
        canvasId: 'myCanvas',
        context: undefined
    },
    onLoad: function () {
        var that = this;
        wx.showLoading({
            mask: true
        });
        //  获取设备系统信息
        wxApiPromise
            .getSystemInfo()
            .then(result => {
                that.setData({
                    canvasHeight: (result.windowHeight - 2) / 2,
                    canvasWidth: result.windowWidth - 2
                })
                //  获取中债国债收益率数据 
                economic
                    .getChinaBondYieldRate()
                    .then(result => {
                        if (result.data.code === 0) {
                            const margin = [], oneYear = [], tenYear = [], date = [];
                            //   计算不同期限的收益率差
                            for (let i = 0, length = result.data.date.length; i < length; i++) {
                                oneYear[i] = result.data.oneYear[length - 1 - i];
                                tenYear[i] = result.data.tenYear[length - 1 - i];
                                date[i] = result.data.date[length - 1 - i];
                                margin[i] = tenYear[i] - oneYear[i];
                            }
                            //   绘制
                            that.context = chart.line({
                                canvasId: that.data.canvasId,
                                height: that.data.canvasHeight,
                                width: that.data.canvasWidth,
                                data: [
                                    { value: oneYear, legend: '一年期' },
                                    { value: tenYear, legend: '十年期' },
                                    { value: margin, legend: '收益率差' }
                                ],
                                labels: result.data.date
                            });
                        } else {
                            //  TODO: 给出相关错误提示
                        }
                        wx.hideLoading();
                    });
            });
    },
    bindTouchStart: function (e) {
        console.log(e);
        chart.interaction(this.context);
    },
    bindTouchMove: function (e) {
        console.log(e);
    },
    bindTouchEnd: function (e) {
        console.log(e);
        chart.clear(this.context);
    }
})
