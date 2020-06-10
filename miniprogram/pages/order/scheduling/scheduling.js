// miniprogram/pages/scheduling.js
const utils = require('../../../utils/date.format.js')
const app = getApp()

Page({

    /**
     * 页面的初始数据
     */
    data: {
        // 此处为日历自定义配置字段
        calendarConfig: {
            /**
             * 初始化日历时指定默认选中日期，如：'2018-3-6' 或 '2018-03-06'
             * 初始化时不默认选中当天，则将该值配置为false。
             */
            multi: true, // 是否开启多选,
            theme: 'default', // 日历主题，目前共两款可选择，默认 default 及 elegant，自定义主题在 theme 文件夹扩展
            showLunar: true, // 是否显示农历，此配置会导致 setTodoLabels 中 showLabelAlways 配置失效
            inverse: true, // 单选模式下是否支持取消选中,
            // defaultDay: '2018-3-6', // string|boolean，string: 默认选中某天/boolean: 不自动选中任何日期
            highlightToday: true, // 是否高亮显示当天，区别于选中样式（初始化时当天高亮并不代表已选中当天）
            // takeoverTap: true, // 是否完全接管日期点击事件（日期不会选中），配合 onTapDay() 使用
            disablePastDay: true, // 是否禁选当天之前的日期
            // disableLaterDay: true, // 是否禁选当天之后的日期
            firstDayOfWeek: 'Mon', // 每周第一天为周一还是周日，默认按周日开始
            onlyShowCurrentMonth: true, // 日历面板是否只显示本月日期
            hideHeadOnWeekMode: false, // 周视图模式是否隐藏日历头部
            showHandlerOnWeekMode: true // 周视图模式是否显示日历头部操作栏，hideHeadOnWeekMode 优先级高于此配置
        },

        slideButtons: [{
            type: 'warn',
            text: '删除'
        }],

        selectedDays: []
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        console.log(options)
        this.troupeName = options._
    },

    /**
     * 选择日期后执行的事件
     * currentSelect 当前点击的日期
     * allSelectedDays 选择的所有日期（当mulit为true时，allSelectedDays有值）
     */
    afterTapDay(e) {
        console.log('afterTapDay', e.detail); // => { currentSelect: {}, allSelectedDays: [] }
        let selectedDays = e.detail.selectedDays.map(item => {
            return {
                year: item.year,
                month: item.month,
                day: item.day,
                lunar: {
                    IMonthCn: item.lunar.IMonthCn,
                    IDayCn: item.lunar.IDayCn,
                    ncWeek: item.lunar.ncWeek
                }
            }
        }).sort(utils.sortDate);

        app.wxp.setStorage({
                key: "__SCHEDULING__",
                data: selectedDays
            })
            .then(res => {
                this.setData({
                    selectedDays: selectedDays
                })
            })
    },

    /**
     * 日历初次渲染完成后触发事件，如设置事件标记
     */
    afterCalendarRender(e) {
        console.log('afterCalendarRender', e);
        /**
         *  从 storage 中加载排班日期
         */
        app.wxp.getStorage({
                key: "__SCHEDULING__"
            })
            .then(res => {
                console.log(res)
                if (res.data && res.data.length > 0) {
                    this.setData({
                        selectedDays: res.data
                    })
                    this.calendar.setSelectedDays(res.data);
                }
            })

        //  禁选指定日期
        //  若入参为空数组，则清空所有禁选日期
        if (this.troupeName) {
            app.wxp.cloud.callFunction({
                    name: "scheduling",
                    data: {
                        action: "troupe",
                        data: encodeURIComponent(JSON.stringify({
                            troupeName: this.troupeName
                        }))
                    }
                })
                .then(res => {
                    console.log(res)
                    if (res.result && res.result.length > 0) {
                        this.calendar.disableDay(res.result);
                    }
                })
                .catch(err => {
                    console.error(err)
                })
        }
    },

    /**
     *  列表项左滑后，点击事件响应
     */
    onSlideButtonTap(e) {
        console.log('onSlideButtonTap', e);

    }
})