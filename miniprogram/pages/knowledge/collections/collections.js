// miniprogram/pages/knowledge/collections/collections.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        title: "专辑",
        collections: [{
            img: "cloud://diandi-software-cloud.6469-diandi-software-cloud-1300349273/articles/Fox/thumbnail.jpg",
            value: "投资必懂的100个经济名词",
            footer: "肖璟",
            url: "/pages/knowledge/folder/folder?album=投资必懂的100个经济名词&folder=Economy"
        }, {
            img: "cloud://diandi-software-cloud.6469-diandi-software-cloud-1300349273/articles/Finance/thumbnail.png",
            value: "清华名师的财务入门课",
            footer: "肖星",
            url: "/pages/knowledge/folder/folder?album=清华名师的财务入门课&folder=Finance"
        }]
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

    }
})