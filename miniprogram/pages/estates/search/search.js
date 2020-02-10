// pages/estates/search/search.js
const app = getApp()

Page({

    /**
     * 页面的初始数据
     */


    data: {
        top: 10,
        topPreSell: [],
        topMonthSell: [],
        topAvailableEstates: [],
        availableEstates: [
            [{
                name: "城厢区",
                value: "chengxiang"
            }, {
                name: "荔城区",
                value: "licheng"
            }, {
                name: "涵江区",
                value: "hanjiang"
            }, {
                name: "秀屿区",
                value: "xiuyu"
            }],
            [{
                    name: "可售住宅",
                    value: "availableNumberHousing"
                }, {
                    name: "可售车库",
                    value: "availableNumberGarage"
                },
                {
                    name: "可售店铺",
                    value: "availableNumberBusiness"
                },
                {
                    name: "可售写字楼",
                    value: "availableNumberOffice"
                }
            ]
        ],
        multiIndex: [0, 0]
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        this.setData({
            search: this.search.bind(this)
        })
    },

    onReady: function() {
        this.getTopStatistic()
    },

    /**
     *  Cell 点击事件
     */
    onCellTap: function(e) {
        console.log(e)
        wx.navigateTo({
            url: '/pages/estates/project/project?_=' + e.currentTarget.dataset.id
        })
    },

    /**
     *  value 改变时触发 change 事件
     */
    onPickerChange: function(e) {
        console.log(e)
        this.setData({
            multiIndex: e.detail.value
        })
        this.getTopStatistic()
    },

    /**
     *  列改变时触发
     */
    onPickerColumnChange: function(e) {
        console.log(e)
    },

    /**
     *  实时搜索
     *  输入过程不断调用此函数得到新的搜索结果，参数是输入框的值value，返回Promise实例
     *  调用search函数的间隔，默认为500ms
     */
    search: function(value) {
        console.log('Search >>> ', value)
        return app.wxp.cloud.callFunction({
                name: 'search',
                data: {
                    action: 'finance',
                    data: encodeURIComponent(JSON.stringify({
                        collection: "_project",
                        field: "name",
                        regexp: value,
                        project: {
                            "name": true
                        },
                        limit: 5
                    }))
                }
            })
            .then(res => {
                console.log(res)
                return new Promise((resolve, reject) => {
                    if (res.result.data && res.result.data.length > 0) {
                        resolve(
                            res.result.data.map(item => {
                                return {
                                    text: item.name,
                                    value: item._id
                                }
                            }))
                    } else {
                        resolve([])
                    }
                })
            })
    },

    /**
     *  选中搜索结果
     */
    selectResult: function(e) {
        wx.navigateTo({
            url: '/pages/estates/project/project?_=' + e.detail.item.value,
        })
    },

    /**
     *  获取排行榜统计数据
     */
    getTopStatistic: function() {
        app.wxp.cloud.callFunction({
                name: 'finance',
                data: {
                    action: 'top',
                    data: encodeURIComponent(JSON.stringify({
                        target: this.data.availableEstates[1][this.data.multiIndex[1]].value, //  可售房产不同类别
                        where: { //  选择行政区域
                            district: this.data.availableEstates[0][this.data.multiIndex[0]].name
                        },
                        district: this.data.availableEstates[0][this.data.multiIndex[0]].name,
                        top: this.data.top //  排行前几位
                    }))
                }
            })
            .then(res => {
                console.log(res)
                if (res.result && res.result.topMonthSell && res.result.topAvailableEstates) {
                    this.setData({
                        topPreSell: res.result.topPreSell,
                        topMonthSell: res.result.topMonthSell,
                        topAvailableEstates: res.result.topAvailableEstates.data.map(item => {
                            item.value = item[this.data.availableEstates[1][this.data.multiIndex[1]].value]
                            return item
                        })
                    })
                }
            })
            .catch(err => {
                console.error(err)
            })
    }
})