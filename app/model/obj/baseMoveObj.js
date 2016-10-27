/**
 * Created by egret on 16/10/20.
 */
var util = require('util');

var BaseObj = require('./baseObj.js');
function BaseMoveObj(){
    BaseObj.call(this);

    this.walkSpeed = 0;
    this.moveAction = null;
}

util.inherits(BaseMoveObj, BaseObj);
module.exports = BaseMoveObj;