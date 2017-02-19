/**
 * Created by egret on 16/1/26.
 */

var User = module.exports;

var Global = require('../../libs/global/global.js');
var Server = require('../../libs/config/server.js');
var Utils = require('../../libs/util/utils.js');
var UserSession = require('../../libs/session/userSession.js');
var UserSessionService = require('../../libs/session/userSessionService.js');
var GameUser = require('../model/gameUser.js');
var Player = require('../model/obj/player.js');
var GameDataService = require('../data/gameDataService.js');
var SceneDataService = require('../data/sceneDataService.js');
var UserDao = require('../dao/userDao.js');
var GameProto = require('../proto/gameProto.js');
var RpcProto = require('../proto/rpcProto.js');
var Log = require('../../libs/log/log.js');
var MyDate = require('../../libs/date/date.js');
var UserCache = require('../cache/userCache.js');
var Rpc = require('../message/rpc.js');
var Scene = require('./scene.js');

User.addUser = function(userSessionId, userId, userConnectorServer, callBack){
    UserCache.getUserById(userId, function(dbUser){
        if(!dbUser) {
            Log.error('不存在用户缓存数据');
            return;
        }

        //在本进程内保存用户基础数据
        var user = new GameUser();
        user.id = userId;
        user.name = dbUser.name;
        user.sessionId = userSessionId;

        var userSession = new UserSession(userSessionId, Global[userConnectorServer]);

        GameDataService.addUser(user, userSession);
        UserSessionService.addSession(userSession);

        callBack(new RpcProto.rpc_userJoinGame_s2c());
    });
}

User.removeUser = function(userSessionId){
    var userSession = UserSessionService.getSession(userSessionId);
    userSession && userSession.close();
}

User.joinScene = function(userSession, sceneId){
    var userData = GameDataService.getUserBySession(userSession.id);
    if(!userData){
        Log.error('该GameServer中不存在此Session~  ' + userSession.id);
        return;
    }

    var sceneInfo = SceneDataService.getScene(sceneId);
    if(!sceneInfo){
        Log.error('该GameServer中不存在此场景~  ' + sceneId);
        return;
    }

    //创建角色实体
    var player = new Player();
    player.id = userData.id;
    player.name = userData.name;
    player.x = Math.floor(Math.random()*sceneInfo.width);
    player.y = Math.floor(Math.random()*sceneInfo.height);
    player.attack = 1000;
    player.defence = 500;
    Scene.addObj(sceneInfo, player);

    userSession.addCloseCallBack(function(){
        Scene.removeObj(player);
    });

    //在用户数据中保存player引用
    userData.player = player;

    //返回客户端消息
    var sendMsg = new GameProto.user_joinScene_s2c();
    sendMsg.player.id = player.id;
    sendMsg.player.name = player.name;
    sendMsg.player.x = player.x;
    sendMsg.player.y = player.y;
    sendMsg.att.attack = player.attack;
    sendMsg.att.defence = player.defence;
    Rpc.notifyClient(userSession, sendMsg);

    //UserCache.getUserById(userId, function(cacheDbUser){
    //    if(cacheDbUser){
    //
    //    } else {
    //        Log.error('不存在用户缓存数据')
    //    }
    //});
}