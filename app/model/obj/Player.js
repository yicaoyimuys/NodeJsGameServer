/**
 * Created by egret on 16/10/20.
 */
var util = require(process.binding('natives').util ? 'util': 'sys');

var BaseAttackObj = require('./baseAttackObj.js');
var ObjType = require('../../comm/objType.js');

function Player(){
    BaseAttackObj.call(this);

    this.type = ObjType.PLAYER;
}

util.inherits(Player, BaseAttackObj);
module.exports = Player;