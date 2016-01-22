/**
 * Created by egret on 16/1/21.
 */
var Timer = module.exports;

Timer.setTimeout = function (delay, calllback, args) {
    return setTimeout(calllback, delay, args);
}

Timer.clearTimeout = function (calllback) {
    clearTimeout(calllback);
}

Timer.setInterval = function (delay, callback, args) {
    return setInterval(callback, delay, args);
}

Timer.clearInterval = function (calllback) {
    clearInterval(calllback);
}