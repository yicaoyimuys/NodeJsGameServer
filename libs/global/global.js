/**
 * Created by egret on 16/1/21.
 */
var Log = require('../log/log.js');

var Global = module.exports;

Global.serverName = '';
Global.serverClients = {};

//绑定当前所连接的服务器
Global.bindServer = function(session, serverName) {
    Global[serverName] = session;
    session.addCloseCallBack(function(){
        Global[serverName] = null;
    });
}

//添加当前所连接的客户端进程
Global.addServerClient = function(session, data){
    Global.bindServer(session, data.serverName);

    Global.serverClients[data.serverName] = session;

    session.addCloseCallBack(function(){
        Global.removeServerClient(session);
    });

    Log.info(data.serverName + ' connect ' + Global.serverName + ' success');
}

//移除当前所连接的客户端进程
Global.removeServerClient = function(session){
    var clients = Global.serverClients;
    for(var serverName in clients) {
        if(clients[serverName] == session) {
            clients[serverName] = null;
            Log.error(serverName + ' disconnect ' + Global.serverName);
            break;
        }
    }
}
