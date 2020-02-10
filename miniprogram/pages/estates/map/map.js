// pages/estates/map/map.js
const app = getApp()

Page({

    /**
     * 页面的初始数据
     */
    data: {
        centerLatitude: 25.43034,
        centerLongitude: 119.003326,
        scale: 15,
        markers: [],
        chosenMarker: {},
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        this.getProjects()
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function() {

    },

    getProjects: function() {
        app.wxp.cloud.callFunction({
                name: 'finance',
                data: {
                    action: 'available',
                    data: encodeURIComponent(JSON.stringify({
                        field: {
                            name: true,
                            location: true,
                            follow: true
                        },
                        limit: 500
                    }))
                }
            })
            .then(res => {
                console.log(res)
                if (res.result.data && res.result.data.length > 0) {
                    // this.recycleContext.append(res.result.data)
                    res.result.data.map(project => {
                        this.data.markers.push({
                            id: project._id,
                            iconPath: project.follow ? '/icons/follow.png' : '/icons/position.png',
                            latitude: project.location.lat,
                            longitude: project.location.lng,
                            width: 25,
                            height: 25,
                            label: {
                                content: project.name,
                                color: "#f2c809",
                                fontSize: 17,
                                anchorX: 15,
                                anchorY: -23,
                                textAlign: "center"
                            }
                        })
                    })

                    this.setData({
                        markers: this.data.markers
                    })
                }
            })
            .catch(err => {
                console.error(err)
            })
    },

    onMarkerTap: function(e) {
        console.log(e)
        wx.navigateTo({
            url: '/pages/estates/project/project?_=' + e.markerId,
        })
    },

    onLabelTap: function(e) {
        console.log(e)
        wx.navigateTo({
            url: '/pages/estates/project/project?_=' + e.markerId,
        })
    }
})