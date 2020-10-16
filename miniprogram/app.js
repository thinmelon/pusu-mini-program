//app.js
import {
    promisifyAll,
    promisify
} from 'miniprogram-api-promise';

const WX_API_PROMISE = require('./utils/wx.api.promise.js');
const QQ_MAP_WX_JSSDK = require('./lib/qqmap-wx-jssdk.min.js'); // 引入QQ MAP SDK核心类

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
    },

    /**
     * 	由坐标到坐标所在位置的文字描述的转换
     * 	输入坐标返回地理位置信息和附近poi列表
     */
    reverseGeocoder: function (options) {
        let qqMapInstance = new QQ_MAP_WX_JSSDK({ // 实例化API核心类
            key: 'MWXBZ-GUH6V-3M6P3-U75XD-TMEQH-HZB4U'
        });
        const that = this;
        return new Promise((resolve, reject) => {
            options.success = function (result) {
                console.log('reverseGeocoder	>>>	', result)
                if (result.status === 0 && result.message === "query ok") {
                    let target = result.result.ad_info.city.substr(0, result.result.ad_info.city.indexOf('市'));
                    let found = false;
                    that.cities.map(city => {
                        if (city === target) {
                            found = true;
                        }
                    })

                    if (found && that.region !== target) { //  检测所在城市与当前位置不一致，提示用户是否切换
                        WX_API_PROMISE.showModal({
                                title: "提示",
                                content: "检测当前所在城市是" + target + "，是否切换？"
                            })
                            .then(res => {
                                if (res.confirm) {
                                    that.region = target;
                                }
                                resolve(res.confirm); //  需要等待用户确定操作
                            });
                    } else {
                        resolve(true); //  一致则直接返回结果
                    }
                } else {
                    reject(false);
                }
            }
            options.fail = function (reason) {
                console.error(reason)
                reject(false);
            }
            qqMapInstance.reverseGeocoder(options);
        });
    }
})