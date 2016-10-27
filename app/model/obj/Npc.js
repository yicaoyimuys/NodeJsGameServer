/**
 * Created by egret on 16/10/20.
 */
var util = require('util');

var BaseObj = require('./baseObj.js');
var ObjType = require('../../comm/objType.js');

function Npc(){
    BaseObj.call(this);

    this.type = ObjType.NPC;
}

util.inherits(Npc, BaseObj);
module.exports = Npc;