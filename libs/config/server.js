/**
 * Created by egret on 16/1/21.
 */
var Server = module.exports;

var Global = require('../global/global.js');
var ServerConfig = require('../../config/server.json');

Server.getByServer = function(server) {
    return ServerConfig[Global.environment][server];
}

Server.getServerID = function(){
    return ServerConfig[Global.environment].serverID;
}

Server.getGameServers = function(){
    return ServerConfig[Global.environment]['game'];
}