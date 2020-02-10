// components/stock.indicator.js
const app = getApp()

Component({
    /**
     * 组件的属性列表
     */
    properties: {
        principle: {
            type: Object,
            value: null
        },
        stock: {
            type: Object,
            value: null
        },
        history: {
            type: Object,
            value: null
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
        lineCanvases: null
    },

    options: {
        addGlobalClass: true,
    },

    /**
     * 组件的方法列表
     */
    methods: {
        onCellTap: function(e) {
            // console.log(e)
            this.setData({
                show: true,
                desc: e.currentTarget.dataset.msg
            })
        }
    },
})