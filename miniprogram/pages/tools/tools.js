// miniprogram/pages/tools/tools.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        /*	    现金流估值    */
        annualCashFlow: 3000,
        discountRate: 12,
        growthRate: 0,
        periods: 5,
        presentWorth: 0,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        this.calculatePresentWorth()
    },

    /**
     *  输入框焦点发生变化
     */
    onInputChange: function(e) {
        this.data[e.currentTarget.dataset.field] = parseInt(e.detail.value)
        this.calculatePresentWorth()
    },

    /**
     *  计算现金流现值
     */
    calculatePresentWorth: function() {
        this.setData({
            presentWorth: (((1 - Math.pow(1 + (this.data.growthRate / 100), this.data.periods) / (Math.pow(1 + (this.data.discountRate / 100), this.data.periods))) * 100 / (this.data.discountRate - this.data.growthRate)) * this.data.annualCashFlow * (1 + this.data.growthRate / 100)).toFixed(2)
        })
    },
})