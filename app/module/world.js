/**
 * Created by egret on 16/10/10.
 */
var World = module.exports;

var WorldDataService = require('../data/worldDataService.js');
var WorldUser = require('../model/worldUser.js');
var UserSession = require('../../libs/session/userSession.js');
var UserSessionService = require('../../libs/session/userSessionService.js');
var Log = require('../../libs/log/log.js');
var Server = require('../../libs/config/server.js');
var Rpc = require('../message/rpc.js');
var RpcProto = require('../proto/rpcProto.js');
var UserCache = require('../cache/userCache.js');
var Async = require('async');

World.addUser = function(data, session, callback){
    var userId = data.userId;
    var userSessionId = data.userSessionId;
    var userConnectorServer = data.userConnectorServer;

    //在Redis中获取用户详细数据
    UserCache.getUserById(userId, function(cacheDbUser){
        if(!cacheDbUser) {
            Log.error('不存在用户缓存数据');
            return;
        }

        //根据所在场景分配游戏服务器
        var userGameServer = Server.allotGameServer(cacheDbUser.last_scene_id);
        var userChatServer = 'chatServer-1';
        var userLoginServer = 'loginServer-1';

        Async.parallel([
            function(callback){
                //通知对应的GameServer
                var sendMsg = new RpcProto.rpc_userJoinGame_c2s();
                sendMsg.userId = userId;
                sendMsg.userSessionId = userSessionId;
                sendMsg.userConnectorServer = userConnectorServer;
                Rpc.call(userGameServer, sendMsg, function(data){
                    callback(null, data.result);
                });
            },
            function(callback){
                //通知对应的ChatServer
                var sendMsg = new RpcProto.rpc_userJoinChat_c2s();
                sendMsg.userId = userId;
                sendMsg.userSessionId = userSessionId;
                sendMsg.userConnectorServer = userConnectorServer;
                sendMsg.userName = cacheDbUser.name;
                sendMsg.unionId = cacheDbUser.unionId || '测试帮会';
                Rpc.call(userChatServer, sendMsg, function(data){
                    callback(null, data.result);
                });
            }
        ],
        function(err, results){
            //在World服务器中保存用户数据
            var user = new WorldUser();
            user.id = userId;
            user.sessionId = userSessionId;
            user.gameServer = userGameServer;
            user.connectorServer = userConnectorServer;
            user.chatServer = userChatServer;
            user.loginServer = userLoginServer;

            var userSession = new UserSession(userSessionId, session);
            WorldDataService.addUser(user, userSession);
            UserSessionService.addSession(userSession);
            Log.info("在线用户数：" + UserSessionService.getSessionCount());

            //返回数据
            var callBackMsg = new RpcProto.rpc_userJoinWorld_s2c();
            callBackMsg.result = 0;
            callback(callBackMsg);
        });
    });
}

World.removeUser = function(data){
    var userSessionId = data.userSessionId;
    var user = WorldDataService.getUserBySession(userSessionId);
    if(!user){
        return;
    }

    var userGameServer = user.gameServer;
    var userChatServer = user.chatServer;

    //通知对应的GameServer
    var sendMsg = new RpcProto.rpc_userExitGame_c2s();
    sendMsg.userSessionId = userSessionId;
    Rpc.notify(userGameServer, sendMsg);

    //通知对应的ChatServer
    var sendMsg = new RpcProto.rpc_userExitChat_c2s();
    sendMsg.userSessionId = userSessionId;
    Rpc.notify(userChatServer, sendMsg);

    //在WorldServer下线
    var userSession = UserSessionService.getSession(userSessionId);
    userSession && userSession.close();
    Log.info("在线用户数：" + UserSessionService.getSessionCount());
}