/**
 * Created by egret on 16/10/20.
 */
var util = require('util');

var BaseAttackObj = require('./baseAttackObj.js');
var ObjType = require('../../comm/objType.js');
var SceneConst = require('../../comm/sceneConst.js');

function Player(){
    BaseAttackObj.call(this);

    this.type = ObjType.PLAYER;
    this.walkSpeed = SceneConst.WALK_SPEED;
}

util.inherits(Player, BaseAttackObj);
module.exports = Player;