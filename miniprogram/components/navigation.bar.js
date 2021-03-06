// components/navigation.bar.js
// const App = getApp();

Component({
    options: {
        addGlobalClass: true,
    },
    /**
     * 组件的属性列表
     */
    properties: {
        pageName: {
            type: String,
            value: ""
        },
        navbarHeight: {
            type: Number,
            value: 0
        },
        navbarTop: {
            type: Number,
            value: 0
        },
        showNav: {
            type: Boolean,
            value: true
        },
        navbarButtons: {
            type: Array,
            value: []
        }
    },

    /**
     * 组件的方法列表
     */
    methods: {
        onNavbarBtnClicked: function(evt) {
            console.log(evt)
            console.log(this.data.pageName)
            const item = this.data.navbarButtons[parseInt(evt.currentTarget.dataset.tapindex)]
            if (item.url) {
                if (item.name === "主页")
                    wx.redirectTo({
                        url: item.url
                    })
                else
                    wx.navigateTo({
                        url: item.url
                    })
            }
        }
    }
})