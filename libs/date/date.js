/**
 * Created by egret on 16/1/27.
 */

var MyDate = module.exports;

MyDate.unix = function(){
    return Math.round(Date.now()/1000);
}