// pages/gold/gold.js
const economic = require('../../services/economic.service.js');

Page({

    /**
     * 页面的初始数据
     */
    data: {
        goldShangHai: [],
        goldBank: [],
        futureShangHai: []
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        this.getShangHaiGold();
        this.getShanagHaiFuture();
        this.getBankGold();
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function() {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function() {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function() {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function() {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function() {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function() {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function() {

    },

    /**
     * 	上海黄金交易所
     */
    getShangHaiGold: function() {
        const that = this;
        economic.getShangHaiGold() // API
            .then(res => {
				console.log(res.data);
                const data = JSON.parse(res.data);
                if (data.hasOwnProperty('error_code') &&
                    data.error_code === 0 &&
                    data.hasOwnProperty('resultcode') &&
                    data.resultcode === "200") {
                    // console.log(data.result[0]);
                    for (let i = 1; i <= 16; i++) {
                        if (data.result[0][i]) {
                            that.data.goldShangHai.push(data.result[0][i]);
                        }
                    }
                    that.setData({
                        goldShangHai: that.data.goldShangHai
                    })
                }
            })
            .catch(err => {
                console.error(err);
            })
    },
    /**
     * 	上海期货交易所
     */
    getShanagHaiFuture: function() {
        const that = this;
        economic.getShanagHaiFuture() // API
            .then(res => {
				console.log(res.data);
                const data = JSON.parse(res.data);
                if (data.hasOwnProperty('error_code') &&
                    data.error_code === 0 &&
                    data.hasOwnProperty('resultcode') &&
                    data.resultcode === "200") {
                    // console.log(data.result[0]);
                    for (let i = 1; i <= 21; i++) {
                        if (data.result[0][i]) {
                            that.data.futureShangHai.push(data.result[0][i]);
                        }
                    }
                    that.setData({
                        futureShangHai: that.data.futureShangHai
                    })
                }
            })
            .catch(err => {
                console.error(err);
            })
    },
    /**
     * 	银行账户黄金
     */
    getBankGold: function() {
        const that = this;
        economic.getBankGold() // API
            .then(res => {
				console.log(res.data);
                const data = JSON.parse(res.data);
                if (data.hasOwnProperty('error_code') &&
                    data.error_code === 0 &&
                    data.hasOwnProperty('resultcode') &&
                    data.resultcode === "200") {
                    for (let i = 1; i <= 8; i++) {
                        if (data.result[0][i]) {
                            that.data.goldBank.push(data.result[0][i]);
                        }
                    }
                    that.setData({
                        goldBank: that.data.goldBank
                    });
                }
            })
            .catch(err => {
                console.error(err);
            })
    }
})