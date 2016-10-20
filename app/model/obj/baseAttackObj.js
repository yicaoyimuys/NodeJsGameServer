/**
 * Created by egret on 16/10/20.
 */
var util = require(process.binding('natives').util ? 'util': 'sys');

var BaseMoveObj = require('./baseMoveObj.js');
function BaseAttackObj(){
    BaseMoveObj.call(this);

    this.attack = 0;
    this.defence = 0;
}

util.inherits(BaseAttackObj, BaseMoveObj);
module.exports = BaseAttackObj;