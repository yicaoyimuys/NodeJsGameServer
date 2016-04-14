/**
 * Created by egret on 16/1/21.
 */
var Log = module.exports;

var Log4js = require('log4js');
var LogConfig = require('../../config/log4js.json');
var Global = require('../global/global.js');

var initLogName = '';

Log.init = function(serverName) {
    initLogName = serverName;
    Log4js.configure(LogConfig[Global.environment]);
}

Log.trace = function(message, logName) {
    Log.log('console', 'trace', message);
    Log.log(logName || initLogName, 'trace', message);
}

Log.debug = function(message, logName) {
    Log.log('console', 'debug', message);
    Log.log(logName || initLogName, 'debug', message);
}

Log.info = function(message, logName) {
    Log.log('console', 'info', message);
    Log.log(logName || initLogName, 'info', message);
}

Log.warn = function(message, logName) {
    Log.log('console', 'warn', message);
    Log.log(logName || initLogName, 'warn', message);
}

Log.error = function(message, logName) {
    Log.log('console', 'error', message);
    Log.log(logName || initLogName, 'error', message);
}

Log.fatal = function(message, logName) {
    Log.log('console', 'fatal', message);
    Log.log(logName || initLogName, 'fatal', message);
}

/**
 * 写入log
 * @param categoryName log标识
 * @param logType [OFF、FATAL、ERROR、WARN、INFO、DEBUG、TRACE、ALL]，级别从高到低
 * @param message log内容
 */
Log.log = function(categoryName, logType, message) {
    var logger = Log4js.getLogger(categoryName);
    if (logger) {
        if(categoryName == 'console'){
            message = '['+initLogName+'] ' + message;
        }
        logger[logType](message);
    }
};