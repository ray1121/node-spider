const winston = require('winston')
const {
    makeSureDirExists
} = require('./lib')
const {
    appBasePath
} = require('../configs')
let loggerBasePath = appBasePath + 'logs'
console.log(appBasePath)
makeSureDirExists(loggerBasePath + '/info')
makeSureDirExists(loggerBasePath + '/error')

winston.loggers.add('nohandle', {
    console: {
        level: 'info',
        colorize: true,
        label: 'noHanle-IC'
    },
    file: {
        filename: loggerBasePath+'/info/'+'nohandle.log',
        label:'info'
    }
});

winston.loggers.add('error', {
    console: {
        level: 'error',
        colorize: true,
        label: 'Error-Ic'
    },
    file: {
        filename: loggerBasePath+'/error/'+'error.log',
        label:'Error-Ic',
        level:'error'
    }
});

winston.loggers.add('nomacth',{
    console:{
        level: 'info',
        colorize: true,
        label: 'noMatch-IC'
    },
    file:{
        filename: loggerBasePath+'/info/'+'nomatch.log',
        label:'info'
    }
})
winston.loggers.add('results',{
    file:{
        filename:appBasePath+'/dist/'+'results.txt',
        level: 'info',
        timestamp:false
    }
})

let logNoHandle= winston.loggers.get('nohandle')
let logError= winston.loggers.get('error')
let logNoMatch = winston.loggers.get('nomacth')
let results = winston.loggers.get('results')
module.exports = {
    nohandle:function(msg){
        logNoHandle.info(msg)
    },
    nomacth:function(msg){
        logNoMatch.info(msg)
    },
    error:function(msg){
        logError.error(msg)
    },
    results:function(str) {
        results.info(str)
    }
}