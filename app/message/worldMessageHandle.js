/**
 * Created by egret on 16/1/26.
 */
var WorldMessageHandle = module.exports;

var World = require('../module/world.js');
var SystemProto = require('../proto/systemProto.js');
var Utils = require('../../libs/util/utils.js');

WorldMessageHandle.handles = {};
WorldMessageHandle.handles[SystemProto.ID_system_clientOnline] = function(data, session){
    World.userOnline(data, session);
};
WorldMessageHandle.handles[SystemProto.ID_system_clientOffline] = function(data) {
    World.userOffline(data);
}

