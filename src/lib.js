const { manufacturer } = require('../configs')
const fs = require('fs')
const mkdirp = require('mkdirp')
const readline = require('readline')



class Tools{
    /**
     * 延迟处理 
     * @param {number} time [单位毫秒]
     * @returns {promise}
     */
    static delay(time){
        return new Promise((resolve,reject) => {
            setTimeout(() => {
                try {
                    resolve(1)
                } catch (e) {
                    reject(0)
                }
            },time)
        })
    }
    /**
     * 判断是不是TI厂家
     * @param {string} mf [输入描述厂家的字符串]
     * @returns {bollean}
     */
    static isManufacturer(mf){
        let _mf = mf.toLowerCase()
        return new RegExp(manufacturer).test(_mf)
    }
    /**
     * 
     * @param {string} targetName [目标芯片名称]
     * @param {string} queryName [爬虫获取的芯片名称]
     */
    static isTarget(targetName,queryName){
        let _targetName = targetName.toLowerCase()
        let _queryName = queryName.toLowerCase()
        return _targetName === _queryName
    }
    static makeSureDirExists(path){
        fs.exists(path, function (exists) {
            if (!exists) {
                mkdirp(path, function (err) {
                    if (err) {
                        console.error(err);
                    }
                });
            }
        });
    }
}

module.exports = Tools