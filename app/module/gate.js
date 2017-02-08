/**
 * Created by egret on 17/1/20.
 */
var Gate = module.exports;

var Server = require('../../libs/config/server.js');
var GameProto = require('../proto/gameProto.js');
var Log = require('../../libs/log/log.js');
var GateMessage = require('../message/gateMessage.js');

var connectorServers = [];
Gate.init = function(){
    var connectorServerConfig = Server.getByServer('connector');
    for(var key in connectorServerConfig){
        connectorServers.push(connectorServerConfig[key]);
    }
}

Gate.init();

Gate.allotConnector = function(session, data){
    var userId = data.userId;
    var code = Math.abs(hashCode(userId));
    var index = code%connectorServers.length;
    var server = connectorServers[index];
    if(!server){
        Log.error('Connector找不到error：' + userId + ' ' + code + ' ' + index);
        return;
    }

    var sendMsg = new GameProto.get_connector_s2c();
    sendMsg.ip = server.host;
    sendMsg.port = server.clientPort + '';
    GateMessage.send(session, sendMsg.encode());
}

function hashCode(str){
    var hash = 0;
    if (str.length == 0) return hash;
    for (i = 0; i < str.length; i++) {
        char = str.charCodeAt(i);
        hash = ((hash<<5)-hash)+char;
        hash = hash & hash; // Convert to 32bit integer
    }
    return hash;
}