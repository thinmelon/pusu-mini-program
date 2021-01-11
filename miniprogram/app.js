//app.js
import {
    promisifyAll,
    promisify
} from 'miniprogram-api-promise';

App({
    /**
     * 系统设置
     * 
     */
    environment: 'DEBUG', //	测试环境：DEBUG		生产环境：PRODUCTION
    timeOut: 1000, //	超时重试：1000毫秒
    maxRetry: 2, //	最大重试次数
    windowWidth: 320, //  设备窗口宽度
    windowHeight: 270, //  设备窗口高度

    onLaunch: function () {
        const systemInfo = wx.getSystemInfoSync()
        this.windowWidth = systemInfo.windowWidth

        if (!wx.cloud) {
            console.error('请使用 2.2.3 或以上的基础库以使用云能力')
        } else {
            wx.cloud.init({
                // env 参数说明：
                //   env 参数决定接下来小程序发起的云开发调用（wx.cloud.xxx）会默认请求到哪个云环境的资源
                //   此处请填入环境 ID, 环境 ID 可打开云控制台查看
                //   如不填则使用默认环境（第一个创建的环境）
                env: 'diandi-software-cloud',
                traceUser: true,
            })
        }

        // 扩展微信小程序api支持promise
        this.wxp = {}
        promisifyAll(wx, this.wxp)
        // promisify all wx's api
        // wxp.getSystemInfo().then(console.log)
        // promisify single api
        // promisify(wx.getSystemInfo)().then(console.log)
    },

    getRandomColor: function () {
        return "#" + ("00000" + ((Math.random() * 16777215 + 0.5) >> 0).toString(16)).slice(-6);
    }
})