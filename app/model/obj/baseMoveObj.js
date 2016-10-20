/**
 * Created by egret on 16/10/20.
 */
var util = require(process.binding('natives').util ? 'util': 'sys');

var BaseObj = require('./baseObj.js');
function BaseMoveObj(){
    BaseObj.call(this);

    this.walkTime = 0;
    this.walkPaths = [];
}

util.inherits(BaseMoveObj, BaseObj);
module.exports = BaseMoveObj;