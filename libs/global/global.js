/**
 * Created by egret on 16/1/21.
 */
var Log = require('../log/log.js');

var Global = module.exports;

Global.serverName = '';
Global.serverID = 0;
Global.serverClients = {};

//当前进程所连接的服务器，
Global.gateServer = null;
Global.chatServer = null;
Global.logServer = null;

Global.addServerClient = function(session, data){
    if(!Global.serverClients[data.serverName]){
        Global.serverClients[data.serverName] = {};
    }

    Global.serverClients[data.serverName][data.serverId] = session;

    session.addCloseCallBack(function(){
        Global.removeServerClient(session);
    });

    Log.info(data.serverName + ':' + data.serverId + ' connect ' + Global.serverName + ' success');
}

Global.removeServerClient = function(session){
    var clients = Global.serverClients;
    for(var serverName in clients) {
        for(var serverId in clients[serverName]){
            if(clients[serverName][serverId] == session){
                clients[serverName][serverId] = null;
                delete clients[serverName][serverId];
                Log.warn(serverName + ':' + serverId + ' disconnect ' + Global.serverName);
                break;
            }
        }
    }
}

//当前进程所连接的客户端
Global.chatServerClient = function(){
    var clients = Global.serverClients;
    var serverName = 'chatServer';
    var serverId = 0;
    if(!clients[serverName]){
        return null;
    }
    return clients[serverName][serverId];
}

Global.loginServerClient = function(){
    var clients = Global.serverClients;
    var serverName = 'loginServer';
    var serverId = 0;
    if(!clients[serverName]){
        return null;
    }
    return clients[serverName][serverId];
}

Global.gameServerClient = function(serverId){
    var clients = Global.serverClients;
    var serverName = 'gameServer';
    if(!clients[serverName]){
        return null;
    }
    return clients[serverName][serverId];
}
