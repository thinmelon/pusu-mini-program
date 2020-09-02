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

    /**
     *  股票市场
     *  
     */
    markets: [{
        name: 'A股', //  名称
        abbreviation: 'hs', //  缩写
        icon: 'cloud://diandi-software-cloud.6469-diandi-software-cloud-1300349273/stock/China.png', //  启用图标
        disabledIcon: 'cloud://diandi-software-cloud.6469-diandi-software-cloud-1300349273/stock/Grey.png', //  禁用图标

        /**
         *  点击股票弹出的ActionSheet显示内容荐
         */
        properties: [{
            tapIndex: 0, //  索引
            name: '公司资讯', //  项目名
            url: '/pages/stock/announcement?market=hs' //  跳转页面路径 
        }, {
            tapIndex: 1,
            name: '股权结构',
            url: '/pages/stock/pledge?market=hs'
        }, {
            tapIndex: 2,
            name: '资产负债',
            url: '/pages/stock/balance?market=hs'
        }, {
            tapIndex: 3,
            name: 'K线',
            url: '/pages/stock/k.line?market=hs'
        }],
        enable: true
    }, {
        name: '港股',
        abbreviation: 'hk',
        icon: 'cloud://diandi-software-cloud.6469-diandi-software-cloud-1300349273/stock/HongKong.png',
        disabledIcon: 'cloud://diandi-software-cloud.6469-diandi-software-cloud-1300349273/stock/Grey.png',
        properties: [{
            tapIndex: 0,
            name: 'K线',
            url: '/pages/stock/k.line?market=hk'
        }],
        enable: false
    }, {
        name: '美股',
        abbreviation: 'usa',
        icon: 'cloud://diandi-software-cloud.6469-diandi-software-cloud-1300349273/stock/UnitedStates.png',
        disabledIcon: 'cloud://diandi-software-cloud.6469-diandi-software-cloud-1300349273/stock/Grey.png',
        properties: [{
            tapIndex: 0,
            name: 'K线',
            url: '/pages/stock/k.line?market=usa'
        }],
        enable: false
    }],

    /**
     *  知识体系（很帅的投资客）
     * 
     */
    hierarchy: [{
        subject: "Bond",
        articles: [{
            title: "什么是收益率曲线倒挂？",
            href: "cloud://diandi-software-cloud.6469-diandi-software-cloud-1300349273/articles/yield-curve-inversion/",
            num: 11
        }]
    }, {
        subject: "Money",
        articles: [{
            title: "货币信用框架理论",
            href: "cloud://diandi-software-cloud.6469-diandi-software-cloud-1300349273/articles/financing-aggregate/",
            num: 15
        }]
    }, {
        subject: "Currency",
        articles: [{
            title: "什么是中间价？",
            href: "cloud://diandi-software-cloud.6469-diandi-software-cloud-1300349273/articles/RMB-exchange-rate/",
            num: 8
        }, {
            title: "什么是不可能三角？",
            href: "cloud://diandi-software-cloud.6469-diandi-software-cloud-1300349273/articles/impossible-trinity/",
            num: 10
        }]
    }, {
        subject: "Estates",
        articles: [{
            title: "什么是交易方程式？",
            href: "cloud://diandi-software-cloud.6469-diandi-software-cloud-1300349273/articles/equation-of-exchange/",
            num: 13
        }, {
            title: "什么是通货紧缩？",
            href: "cloud://diandi-software-cloud.6469-diandi-software-cloud-1300349273/articles/Deflation/",
            num: 7
        }, {
            title: "央行是怎么印钱的？",
            href: "cloud://diandi-software-cloud.6469-diandi-software-cloud-1300349273/articles/M2/",
            num: 13
        }, {
            title: "利率的本质是什么？",
            href: "cloud://diandi-software-cloud.6469-diandi-software-cloud-1300349273/articles/interest-rate/",
            num: 17
        }, {
            title: "央行的货币政策工具有哪些？",
            href: "cloud://diandi-software-cloud.6469-diandi-software-cloud-1300349273/articles/monetary-policy-instruments/",
            num: 19
        }, {
            title: "什么是棚改货币化？",
            href: "cloud://diandi-software-cloud.6469-diandi-software-cloud-1300349273/articles/pledged-supplementary-lending/",
            num: 9
        }, {
            title: "房价涨幅多少合适？",
            href: "cloud://diandi-software-cloud.6469-diandi-software-cloud-1300349273/articles/increasement/",
            num: 7
        }]
    }, {
        subject: "Stock",
        articles: [{
            title: "什么是商誉减值？",
            href: "cloud://diandi-software-cloud.6469-diandi-software-cloud-1300349273/articles/GoodWill/",
            num: 8
        }, {
            title: "如何避开股权质押这颗雷？",
            href: "cloud://diandi-software-cloud.6469-diandi-software-cloud-1300349273/articles/pledge-of-stock-right/",
            num: 12
        }]
    }],


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