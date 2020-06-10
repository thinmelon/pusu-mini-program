// pages/order/refund/refund.js
const utils = require('../../../utils/date.format.js')
const app = getApp()

Page({

    /**
     * 页面的初始数据
     */
    data: {
        responsible: 0, //  责任方
        // reason: "", //  理由
        other: "", //  输入框
        /**
         *  根据距离演出日期的时长计算退款金额
         */
        totalFee: 0,
        penalty: 0,

        responsibles: [{
            name: "自身原因",
            value: 0,
            checked: true
        }, {
            name: "其它原因",
            value: 1,
            checked: false
        }],

        // reasons: [{
        //     name: "行程冲突",
        //     value: 0,
        //     checked: true
        // }, {
        //     name: "其它",
        //     value: 1,
        //     checked: false
        // }]
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        this.refund = JSON.parse(options._);
        //  订单编号， 订单金额， 剧团名称， 演出日期
        this.setData({
            totalFee: this.refund.totalFee,
            penalty: this.calculatePenalty(this.refund.dramaDate[0], this.refund.totalFee)
        })
    },

    onResponsibleChange: function(e) {
        console.log(e)
        this.setData({
            responsible: parseInt(e.detail.value)
        })
    },

    // onReasonChange: function(e) {
    //     console.log(e)
    // },

    onOtherInputBlur: function(e) {
        console.log("onOtherInputBlur", e)
    },

    onRefundTap: function(e) {
        console.log("onRefundTap", e)
        if (this.data.responsible === 1 && this.data.other === "") {
            this.setData({
                error: "请填写申请全额退款理由"
            })
        } else {
            const refundFee = this.data.responsible === 1 ? this.data.totalFee : this.data.totalFee - this.data.penalty
            const penalty = this.data.responsible === 1 ? 0 : this.data.penalty
            app.wxp.cloud.callFunction({
                    name: "order",
                    data: {
                        action: "refund",
                        data: encodeURIComponent(JSON.stringify({
                            process: 0, //  进度： 申请退款
                            formId: e.detail.formId, // 表单ID
                            outTradeNo: this.refund.outTradeNo, //   订单编号 
                            reason: this.data.other || "因客户自身原因",
                            penalty: penalty,
                            refundFee: refundFee,
                            troupeName: this.refund.troupeName,
                            customer: this.refund.customer,
                            mobile: this.refund.mobile
                        }))
                    }
                })
                .then(params => {
                    console.log(params)
                    if (params.result.errMsg === "OK") {
                        // wx.showToast({
                        //     title: '等待剧团审核',
                        // })
                        wx.redirectTo({
                            url: '/pages/order/order',
                        })
                    }
                })
                .catch(err => {
                    console.error(err)
                })
        }
    },

    calculatePenalty: function(startDate, totalFee) {
        const diff = utils.diff(startDate);
        console.log('距离演出日还有', diff, '天')
        //  不足5天的按订单金额80%计
        if (diff <= 5) {
            return totalFee * 0.8;
        }
        //  演出前5天以上，不足10天的按订单金额50%计
        else if (diff > 5 && diff <= 10) {
            return totalFee * 0.5;
        }
        //  演出前10天以上的按订单金额20%计
        else if (diff > 10 && diff <= 30) {
            return totalFee * 0.2;
        }
        //  演出前30天(不含)以上取消订单的，不收取违约金
        else {
            return 0;
        }
    }
})