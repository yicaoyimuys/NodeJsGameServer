/**
 * Created by egret on 16/10/20.
 */
var util = require('util');

var BaseAttackObj = require('./baseAttackObj.js');
var ObjType = require('../../comm/objType.js');

function Enemy(){
    BaseAttackObj.call(this);

    this.type = ObjType.ENEMY;
}

util.inherits(Enemy, BaseAttackObj);
module.exports = Enemy;