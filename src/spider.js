const noinsql2 = require('./noinsql2.js')
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
            let detailPage = await browser.newPage()
            await detailPage.goto(queryTarget.queryLink)
            detailPage.on('console', (content) => {
                console.log(content)
            })
            let detailInfo = await detailPage.evaluate(() => {
                let Name = document.querySelector('span.part-number') ? document.querySelector('span.part-number').innerText : ''
                // 返回一个字符串数组
                let shortInfoTem = document.querySelector('div.information.column')
                let shortInfo = {}
                if (shortInfoTem) {
                    shortInfoTem = shortInfoTem.innerText.split('\n')
                    shortInfo = {
                        PartCategory: shortInfoTem[0].split(': ')[1],
                        Description: shortInfoTem[2].split(': ')[1]
                    }
                }

                let pdfUrl = document.querySelector('div.first.column a').href.slice(28)
                let specifications = {}
                try {
                    let specifiLength = document.querySelectorAll('tr.spec').length
                    if (specifiLength) {
                        for (let index = 0; index < specifiLength; index++) {
                            let specKey = document.querySelectorAll('td.spec-name')[index].innerText
                            let specValue = document.querySelectorAll('td.spec-value')[index].innerText
                            specifications[specKey] = specValue
                        }
                    }
                    return {
                        Name,
                        Manufacturer: "Texas Instruments",
                        ...shortInfo,
                        pdfUrl,
                        specifications
                    }
                } catch (error) {
                    console.log('表单出错')
                }

            })
            await detailPage.close()
            logger.results(JSON.stringify(detailInfo))
        } else {
            logger.nomacth(`${icName}`)
            await detailPage.close()
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
    for (let index = 0; index < noinsql2.length; index++) {
        try {
            await spiderForD5(browser, noinsql2[index])
        } catch (error) {
            logger.nohandle(`${noinsql2[index]}`)
        }
        
    }
    console.log('TMD结束了')
}

main()