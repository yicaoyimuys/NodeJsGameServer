/**
 * Created by egret on 16/1/26.
 */
var GateMessageHandle = module.exports;

var GameProto = require('../proto/gameProto.js');
var Utils = require('../../libs/util/utils.js');
var Gate = require('../module/gate.js');

GateMessageHandle.handles = {};
GateMessageHandle.handles[GameProto.ID_get_connector_c2s] = function(data, session){
    Gate.allotConnector(session, data);
};

