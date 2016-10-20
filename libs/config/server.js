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

Server.allotGameServer = function(sceneId){
    var gameServers = Server.getGameServers();
    for(var key in gameServers){
        var serverInfo = gameServers[key];
        if(serverInfo.scenes.indexOf(sceneId) != -1){
            return serverInfo.id;
        }
    }
    return null;
}

Server.getScenes = function(serverName){
    var gameServers = Server.getGameServers();
    for(var key in gameServers){
        var serverInfo = gameServers[key];
        if(serverInfo.id == serverName){
            return serverInfo.scenes;
        }
    }
    return null;
}