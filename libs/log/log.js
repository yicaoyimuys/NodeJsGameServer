/**
 * Created by egret on 16/1/21.
 */
var Log = module.exports;

var Log4js = require('log4js');
var LogConfig = require('../../config/log4js.json');

var $serverName = '';

Log.init = function(serverName) {
    $serverName = serverName;
    Log4js.configure(LogConfig);
}

Log.trace = function(message) {
    Log.log('console', 'trace', message);
    Log.log($serverName, 'trace', message);
}

Log.debug = function(message) {
    Log.log('console', 'debug', message);
    Log.log($serverName, 'debug', message);
}

Log.info = function(message) {
    Log.log('console', 'info', message);
    Log.log($serverName, 'info', message);
}

Log.warn = function(message) {
    Log.log('console', 'warn', message);
    Log.log($serverName, 'warn', message);
}

Log.error = function(message) {
    Log.log('console', 'error', message);
    Log.log($serverName, 'error', message);
}

Log.fatal = function(message) {
    Log.log('console', 'fatal', message);
    Log.log($serverName, 'fatal', message);
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
        logger[logType]('['+$serverName+'] ' + message);
    }
};