const icname = require('./icname')
const fs = require('fs')
const puppteer = require('puppeteer')
const {
    delay,
    isManufacturer,
    isTarget
} = require('./lib.js')
const {
    targetUrl
} = require('../configs')
const logger = require('./logger')


let spiderForD5 = async (browser, icName) => {
    let page = await browser.newPage();
    await page.goto(`${targetUrl}${icName}`)
    let queryTarget = await page.evaluate(() => {
        let queryResult = document.querySelector('.mfg .part-name a')
        let queryManufacturer = document.querySelector('.mfg .description')
        if (queryResult && queryManufacturer) {
            let queryName = queryResult.innerText.slice(6)
            let queryLink = queryResult.href
            return {
                queryName,
                queryLink,
                queryManufacturer: queryManufacturer.innerText
            }
        } else {
            return;
        }
    })
    await page.close()
    if (queryTarget) {
        // 判断结果是否满足爬虫条件
        if (isManufacturer(queryTarget.queryManufacturer) && isTarget(icName, queryTarget.queryName)) {
            logger.results(queryTarget.queryLink)
        } else {
            logger.nomacth(`${icName}`)
            return;
        }
    } else {
        return;
    }

}
let main = async () => {
    const browser = await puppteer.launch({
        ignoreHTTPSErrors: true, //忽略https错误
        headless: true
    })
    let len = icname.length
    for (let index = 0; index < len; index++) {
        // try {
            await spiderForD5(browser, icname[index])
        // } catch (error) {
        //     logger.nohandle(`${icname[index]}`)
        // }
        
    }
    console.log('TMD结束了')
}

main()