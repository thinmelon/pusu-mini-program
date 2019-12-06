const axios = require('axios')
const cheerio = require('cheerio')
const cloud = require('wx-server-sdk')
const url = require('../utils/url.js')


// 初始化 cloud
cloud.init({
    env: 'diandi-software-cloud'
})

// 可在入口函数外缓存 db 对象
const db = cloud.database()

// 数据库查询更新指令对象
const _ = db.command

async function main(request) {
    try {
        const pageData = await axios.get(url.HOUSE_CONTRACT_STATISTICS)
        if (pageData.status === 200) {
            const $ = cheerio.load(pageData.data, {
                xml: {
                    normalizeWhitespace: true
                }
            })

            $('tr th').each((i, tr) => {
                console.log($(this).text());
            })


            return null
        } else {
            return {
                errMsg: "无法获取到数据！"
            }
        }
    } catch (err) {
        console.error(err)
        return err
    }
}

module.exports = {
    main
}