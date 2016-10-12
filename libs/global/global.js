/**
 * Created by egret on 16/1/21.
 */
var Log = require('../log/log.js');
var Program = require('../program/program.js');
var Server = require('../config/server.js');

var Global = module.exports;

//当前环境(开发，生产)
Global.environment = Program.environment || 'development';
//当前服务器名称
Global.serverName = '';
//当前服务器所连接的后台客户端
Global.serverClients = {};
//当前服务器所连接的userDb
Global.userDb = null;
//当前服务器所连接的redis
Global.redis = null;
//当前服务器所连接的game后台服务器
Global.gameServerClients = null;

//绑定当前所连接的服务器
Global.bindServer = function(session, serverName) {
    var existsSession = Global[serverName];
    if(existsSession){
        existsSession.close(true);
        existsSession = null;
        Log.warn('bindServer exists same server：' + serverName);
    }

    Global[serverName] = session;
    session.addCloseCallBack(function(){
        Global[serverName] = null;
    });
}

//添加当前所连接的客户端进程
Global.addServerClient = function(session, data){
    var serverName = data.serverName;
    var existsSession = Global.serverClients[serverName];
    if(existsSession){
        existsSession.close(true);
        existsSession = null;
        Log.warn('addServerClient exists same server：' + serverName);
    }

    Global.bindServer(session, serverName);

    Global.serverClients[serverName] = session;
    session.addCloseCallBack(function(){
        Global.serverClients[serverName] = null;
        Log.error(serverName + ' disconnect on ' + Global.serverName);
    });

    Log.info(serverName + ' connect ' + Global.serverName + ' success');
}

function GameServerInfo($id){
    this.id = $id;
    this.users = [];
}

//在网关中记录游戏服务器中用户列表
Global.gameServerAddUser = function(serverName, session){
    if(!Global.gameServerClients){
        Global.gameServerClients = {};
        var gameServers = Server.getGameServers();
        for(var key in gameServers){
            var name = gameServers[key].id;
            Global.gameServerClients[name] = new GameServerInfo(name);
        }
    }

    var server = Global.gameServerClients[serverName];
    if(!server){
        return;
    }

    server.users.push(session.id);
    session.addCloseCallBack(function(){
        server.users.splice(server.users.indexOf(session.id), 1);
    });
}

Global.isLoginServer = function(){
    return Global.serverName.indexOf('loginServer') != -1;
}
