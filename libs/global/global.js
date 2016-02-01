/**
 * Created by egret on 16/1/21.
 */
var Log = require('../log/log.js');

var Global = module.exports;

//当前服务器名称
Global.serverName = '';
//当前服务器所连接的后台客户端
Global.serverClients = {};
//当前服务器所连接的userDb
Global.userDb = null;
//异步db操作
Global.asyncUserDb = null;
//当前服务器所连接的redis
Global.redis = null;

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
            Log.error(serverName + ' disconnect on ' + Global.serverName);
            break;
        }
    }
}
