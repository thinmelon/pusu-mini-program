// pages/order/details/details.js
const utils = require('../../../utils/date.format.js')
const app = getApp()

Page({

    /**
     * 页面的初始数据
     */
    data: {
        order: {}
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        this.getOrderDetails(options._)
    },

    /**
     * 立即支付
     */
    onPayTap: function(e) {
        console.log(e)
        app.wxp.cloud.callFunction({
                name: "order",
                data: {
                    action: "submit",
                    data: encodeURIComponent(JSON.stringify({
                        outTradeNo: this.data.order._id, //   outTradeNo
                        totalFee: this.data.order.totalFee, //  订单价格， 以分为单位 
                        body: this.data.order.troupeName,
                        attach: e.detail.formId //  在向剧团发送支付成功的消息时用到
                    }))
                }
            })
            .then(params => {
                console.log(params.result)
                if (params.result.return_code === 'SUCCESS' &&
                    params.result.result_code === 'SUCCESS'
                ) {
                    app.wxp.requestPayment(params.result)
                        .then(this.payment)
                        .then(res => {
                            console.log(res)
                            app.wxp.showToast({
                                    title: "支付成功",
                                    icon: "success",
                                    mask: true,
                                    duration: 3000
                                })
                                .then(() => {
                                    setTimeout(() => {
                                        wx.redirectTo({
                                            url: '/pages/order/list/list',
                                        })
                                    }, 2000)
                                })
                        })
                        .catch(err => {
                            console.error('app.wxp.requestPayment', err)
                            if (err.errMsg === "requestPayment:fail cancel") {
                                this.setData({
                                    error: "取消支付"
                                })
                            }
                        })

                } else {
                    let errMsg = params.result.err_code_des ? params.result.err_code_des : "支付未成功"
                    this.setData({
                        error: errMsg
                    })
                }

            })
            .catch(err => {
                console.error(err)
            })
    },

    onRefundTap: function(e) {
        wx.navigateTo({
            url: '/pages/order/refund/refund?_=' + JSON.stringify({
                outTradeNo: this.data.order._id, //   outTradeNo
                totalFee: this.data.order.totalFee, //  订单价格， 以分为单位 
                troupeName: this.data.order.troupeName, //   剧团名称 
                dramaDate: this.data.order.dramaDate, //  演出日期
                customer: this.data.order.customer, //  联系人
                mobile: this.data.order.mobile //  联系方式 
            }),
        })
    },

    payment: function(request) {
        return app.wxp.cloud.callFunction({
            name: "order",
            data: {
                action: "query",
                data: encodeURIComponent(JSON.stringify({
                    outTradeNo: this.data.order._id
                }))
            }
        })
    },

    getOrderDetails: function(_id) {
        app.wxp.cloud.callFunction({
                name: "database",
                data: {
                    collection: "_order",
                    where: encodeURIComponent(JSON.stringify({
                        _id: _id
                    }))
                }
            })
            .then(res => {
                console.log(res)
                if (res.result && res.result.data && res.result.data.length === 1) {
                    let order = res.result.data[0];

                    if (order.createTime) order.createTime = utils.formatDateString(order.createTime);
                    if (order.checkTime) order.checkTime = utils.formatDateString(order.checkTime);
                    if (order.prepayTime) order.prepayTime = utils.formatDateString(order.prepayTime);
                    if (order.endTime) order.endTime = utils.formatDateString(order.endTime);
                    if (order.closeTime) order.closeTime = utils.formatDateString(order.closeTime);

                    this.setData({
                        order: order
                    })
                }
            })
            .catch(err => {
                console.error(err)
            });
    }
})