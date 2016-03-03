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
//当前服务器所连接的redis
Global.redis = null;
//当前服务器所连接的game后台服务器
Global.gameServerClients = [];
Global.allotGameServerIndex = 0;

//绑定当前所连接的服务器
Global.bindServer = function(session, serverName) {
    Global[serverName] = session;
    session.addCloseCallBack(function(){
        Global[serverName] = null;
    });
}

//添加当前所连接的客户端进程
Global.addServerClient = function(session, data){
    var serverName = data.serverName;
    if(Global.serverClients[serverName]){
        Log.error('exists same server：' + serverName);
        return;
    }

    Global.bindServer(session, serverName);

    Global.serverClients[serverName] = session;
    session.addCloseCallBack(function(){
        Global.serverClients[serverName] = null;
        Log.error(serverName + ' disconnect on ' + Global.serverName);
    });

    //GameServer特殊处理
    if(serverName.indexOf('gameServer') != -1){
        Global.gameServerClients.push(new GameServerInfo(serverName));
        session.addCloseCallBack(function(){
            var clients = Global.gameServerClients;
            for(var i=0; i<clients.length; i++){
                if(clients[i].id == serverName){
                    clients.splice(i, 1);
                    break;
                }
            }
        });
    }

    Log.info(serverName + ' connect ' + Global.serverName + ' success');
}

function GameServerInfo($id){
    this.id = $id;
    this.users = [];
}

//给用户分配游戏服务器
Global.allotGameServer = function(session){
    session.bindGameServer(null);

    if(Global.gameServerClients.length == 0){
        return;
    }

    var serverInfo = Global.gameServerClients[Global.allotGameServerIndex];
    serverInfo.users.push(session);
    session.addCloseCallBack(function(){
        for(var i=0, len=serverInfo.users.length; i<len; i++){
            if(serverInfo.users[i] == session){
                serverInfo.users.splice(i, 1);
                break;
            }
        }
    });

    session.bindGameServer(serverInfo.id);

    Global.allotGameServerIndex++;
    if(Global.allotGameServerIndex == Global.gameServerClients.length){
        Global.allotGameServerIndex = 0;
    }
}