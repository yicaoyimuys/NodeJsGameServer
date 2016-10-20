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
var Log = require('../../libs/log/log.js');
var MyDate = require('../../libs/date/date.js');
var UserCache = require('../cache/userCache.js');
var BackMessage = require('../message/backMessage.js');
var Scene = require('./scene.js');

User.addUser = function(userSessionId, userId){
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

        var userSession = new UserSession(userSessionId, Global[Server.getByServer('gate').id]);

        GameDataService.addUser(user, userSession);
        UserSessionService.addSession(userSession);

        //返回通知客户端登录成功
        var sendMsg = new GameProto.user_login_s2c();
        sendMsg.user.userId = dbUser.id;
        sendMsg.user.userName = dbUser.name;
        sendMsg.user.money = dbUser.money;
        sendMsg.user.create_time = dbUser.create_time;
        sendMsg.user.task = dbUser.task || [9, 8, 3, 2];
        sendMsg.user.sceneId = dbUser.last_scene_id;
        BackMessage.sendToGate(userSession, sendMsg);
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
    player.x = Math.floor(Math.random()*sceneInfo.cols);
    player.y = Math.floor(Math.random()*sceneInfo.rows);
    player.attack = 1000;
    player.defence = 500;
    Scene.addObj(sceneInfo, player);

    userSession.addCloseCallBack(function(){
        Scene.removeObj(player);
    });

    //返回客户端消息
    var sendMsg = new GameProto.user_joinScene_s2c();
    sendMsg.id = player.id;
    sendMsg.name = player.name;
    sendMsg.x = player.x;
    sendMsg.y = player.y;
    sendMsg.attack = player.attack;
    sendMsg.defence = player.defence;
    BackMessage.sendToGate(userSession, sendMsg);

    //UserCache.getUserById(userId, function(cacheDbUser){
    //    if(cacheDbUser){
    //
    //    } else {
    //        Log.error('不存在用户缓存数据')
    //    }
    //});
}