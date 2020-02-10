// pages/stock/note/note.js
const MOMENT = require('../../../lib/moment.min.js')
const app = getApp()

Page({

    /**
     * 页面的初始数据
     */
    data: {
        note: {
            type: 0
        },

        noteTypes: [{
            name: "交易",
            value: 0,
            checked: true
        }, {
            name: "心得",
            value: 1
        }],

        transactionTypes: ["买入", "卖出"],

        startDate: "", //  开始日期
        endDate: "" //  最长结束日期
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        const now = MOMENT().format('YYYY-MM-DD')
        const tenYearsLater = MOMENT().add(10, 'years').format('YYYY-MM-DD')

        if (options._id) {
            app.wxp.cloud.callFunction({
                    name: 'search',
                    data: {
                        action: 'note',
                        data: encodeURIComponent(JSON.stringify({
                            _id: options._id
                        }))
                    }
                })
                .then(res => {
                    console.log(res)
                    if (res.result.data && res.result.data.length === 1) {
                        this.setData({
                            "note": Object.assign(this.data.note, res.result.data[0]),
                            "noteTypes": this.data.noteTypes.map(item => {
                                if (item.value === res.result.data[0].type) {
                                    item.checked = true
                                } else {
                                    item.checked = false
                                }
                                return item
                            }),
                            "startDate": now,
                            "endDate": tenYearsLater
                        })
                    }
                })
                .catch(err => {
                    console.error(err)
                })
        } else {
            this.setData({
                "note.code": options.code,
                "startDate": now,
                "endDate": tenYearsLater
            })
        }
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function() {

    },

    onRadioChange: function(e) {
        this.setData({
            "note.type": parseInt(e.detail.value)
        })
    },

    onTransactionTypeChange: function(e) {
        this.setData({
            "note.transaction": parseInt(e.detail.value)
        })
    },

    onInputChange: function(e) {
        this.setData({
            ["note." + e.currentTarget.dataset.field]: e.detail.value
        })
    },

    onDateChange: function(e) {
        this.setData({
            "note.expiration": e.detail.value
        })
    },

    submit: function(e) {
        app.wxp.cloud.callFunction({
                name: 'finance',
                data: {
                    action: 'note',
                    data: encodeURIComponent(JSON.stringify(this.data.note))
                }
            })
            .then(res => {
                console.log(res)
                wx.navigateBack()
                // wx.redirectTo({
                //     url: '/pages/stock/stock?code=' + this.data.note.code,
                // })

            })
            .catch(err => {
                console.error(err)
            })
    }
})