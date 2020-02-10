const CLOUD = require('wx-server-sdk')

// 初始化 CLOUD
CLOUD.init({
    env: 'diandi-software-cloud'
})

// 可在入口函数外缓存 db 对象
const db = CLOUD.database()

// 数据库查询更新指令对象
const _ = db.command

async function main(request) {
    if (request.collection && request.field && request.regexp) {
        const where = {}
        where[request.field] = db.RegExp({
            regexp: request.regexp,
            options: 'i',
        })

        return await db.collection(request.collection)
            .field(request.project || {})
            //  指定筛选条件
            .where(where)
            //  指定查询结果集数量上限
            .limit(request.limit || 20)
            .get()
    } else {
        return {
            errMsg: "没有找到相关记录。"
        }
    }

}

module.exports = {
    main
}