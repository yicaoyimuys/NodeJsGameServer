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

User.addUser = function(userSessionId, userId, userName){
    var user = new GameUser();
    user.id = userId;
    user.name = userName;
    user.sessionId = userSessionId;

    var userSession = new UserSession(userSessionId, Global[Server.getByServer('gate').id]);

    GameDataService.addUser(user, userSession);
    UserSessionService.addSession(userSession);
}

User.removeUser = function(userSessionId){
    var userSession = UserSessionService.getSession(userSessionId);
    userSession && userSession.close();
}

User.joinGame = function(userSession, userId){
    if(!GameDataService.getUser(userId)){
        Log.error('该GameServer中不存在此用户~  ' + userId);
        return;
    }

    UserCache.getUserById(userId, function(cacheDbUser){
        if(cacheDbUser){
            //返回客户端消息
            var sendMsg = new GameProto.user_joinGame_s2c();
            sendMsg.user.userId = cacheDbUser.id;
            sendMsg.user.userName = cacheDbUser.name;
            sendMsg.user.money = cacheDbUser.money;
            sendMsg.user.create_time = cacheDbUser.create_time;
            sendMsg.user.task = [9, 8, 3, 2];
            BackMessage.sendToGate(userSession, sendMsg);
        } else {
            Log.error('不存在用户缓存数据')
        }
    });
}