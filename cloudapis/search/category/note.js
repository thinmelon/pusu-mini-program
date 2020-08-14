const CLOUD = require('wx-server-sdk')

// 初始化 CLOUD
CLOUD.init({
    env: 'diandi-software-cloud'
})

// 可在入口函数外缓存 db 对象
const db = CLOUD.database()

// 数据库查询更新指令对象
const _ = db.command
const $ = _.aggregate

async function remove(request) {
    return await db.collection('_knowledge')
        .where({
            folder: "Finance"
        })
        .remove()
}

/**
 *      获取该股票的所有交易日记或某条日记
 */
async function main(request) {
    return await db.collection('_note')
        .where(_.or([{
                _id: request._id || ""
            },
            {
                code: request.code || ""
            }
        ]))
        .limit(request.limit || 20)
        .get()
}

module.exports = {
    remove,
    main
}