// components/stock.indicator.js
const app = getApp()

Component({
    /**
     * 组件的属性列表
     */
    properties: {
        //  原则
        principle: {
            type: Object,
            value: null
        },
        //  关注企业的财报数据
        stock: {
            type: Object,
            value: null
        },
        //  关注企业的历史财报数据
        history: {
            type: Object,
            value: null
        },
        //  关注企业的目标财报在历史财报数据中的位置
        target: {
            type: Number,
            value: 11
        },
        //  关注企业的同比财报在历史财报数据中的位置
        contrast: {
            type: Number,
            value: 7
        },
        //  区分标的股与比选股，比选股不显示部分指标
        print: {
            type: Boolean,
            value: true
        },
        //  显示半屏内容提示框
        show: {
            type: Boolean,
            value: false
        }
    },

    /**
     * 组件的初始数据
     */
    data: {
        desc: "质押原因，记录借款人、借款金额、币种等内容",
        lineCanvases: null,
        inputValue: 1000
    },

    options: {
        addGlobalClass: true,
    },

    /**
     * 组件的方法列表
     */
    methods: {
        onCellTap: function (e) {
            // console.log(e)
            const item = e.currentTarget.dataset.item;
            const state = e.currentTarget.dataset.state;
            const content = e.currentTarget.dataset.message;
            let description = ''
            for (let i = 0; i < state.length; i++) {
                if (item[content[i]]) {
                    description += '【' + state[i] + '】 ' + item[content[i]] + '   ###  '
                }
            }
            this.setData({
                show: true,
                desc: description
            })
        },
        onInputValueChanged: function (e) {
            // console.log(e)
            this.setData({
                inputValue: parseInt(e.detail.value)
            })
        }
    },
})