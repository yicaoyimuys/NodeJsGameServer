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
var GameDataService = require('../data/gameDataService.js');
var UserDao = require('../dao/userDao.js');
var GameProto = require('../proto/gameProto.js');
var Log = require('../../libs/log/log.js');
var MyDate = require('../../libs/date/date.js');
var UserCache = require('../cache/userCache.js');
var BackMessage = require('../message/backMessage.js');

User.addUser = function(userSessionId, userId){
    UserCache.getUserById(userId, function(dbUser){
        if(dbUser){
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
            sendMsg.gameServer = Global.serverName;
            BackMessage.sendToGate(userSession, sendMsg);
        } else {
            Log.error('不存在用户缓存数据')
        }
    });
}

User.removeUser = function(userSessionId){
    var userSession = UserSessionService.getSession(userSessionId);
    userSession && userSession.close();
}

User.joinGame = function(userSession){
    var userData = GameDataService.getUserBySession(userSession.id);
    if(!userData){
        Log.error('该GameServer中不存在此用户~  ' + userId);
        return;
    }

    var userId = userData.id;
    UserCache.getUserById(userId, function(cacheDbUser){
        if(cacheDbUser){
            //返回客户端消息
            var sendMsg = new GameProto.user_joinGame_s2c();
            sendMsg.user.userId = cacheDbUser.id;
            sendMsg.user.userName = cacheDbUser.name;
            sendMsg.user.money = cacheDbUser.money;
            sendMsg.user.create_time = cacheDbUser.create_time;
            sendMsg.user.task = cacheDbUser.task || [9, 8, 3, 2];
            BackMessage.sendToGate(userSession, sendMsg);
        } else {
            Log.error('不存在用户缓存数据')
        }
    });
}