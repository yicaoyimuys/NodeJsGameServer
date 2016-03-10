/**
 * Created by egret on 16/1/26.
 */

var User = module.exports;

var Global = require('../../libs/global/global.js');
var Utils = require('../../libs/util/utils.js');
var UserSession = require('../../libs/session/userSession.js');
var DbUserModel = require('../model/dbUser.js');
var UserModel = require('../model/user.js');
var DataService = require('../data/dataService.js');
var UserDao = require('../dao/userDao.js');
var GameProto = require('../proto/gameProto.js');
var SystemProto = require('../proto/systemProto.js');
var Log = require('../../libs/log/log.js');
var MyDate = require('../../libs/date/date.js');
var UserCache = require('../cache/userCache.js');
var BackMessage = require('../message/backMessage.js');

User.joinGame = function(userId, cb, userSessionID){
    UserCache.getUserById(userId, function(cacheDbUser){
        if(cacheDbUser){
            //在内存中缓存用户数据
            var user = new UserModel();
            user.dbUser = cacheDbUser;
            user.session = new UserSession(userSessionID);
            DataService.addUser(user);

            //返回客户端消息
            var sendMsg = new GameProto.user_joinGame_s2c();
            sendMsg.user.userId = cacheDbUser.id;
            sendMsg.user.userName = cacheDbUser.name;
            sendMsg.user.money = cacheDbUser.money;
            sendMsg.user.create_time = cacheDbUser.create_time;
            sendMsg.user.task = [9, 8, 3, 2];
            Utils.invokeCallback(cb, sendMsg);

            //通知Chat服务器，用户上线
            User.joinChat(userSessionID, cacheDbUser);
        } else {
            Log.error('不存在用户缓存数据')
        }
    });
}

User.joinChat = function(userSessionID, dbUser){
    var chatSendMsg = new SystemProto.system_chatAddUser();
    chatSendMsg.userSessionID = userSessionID;
    chatSendMsg.userId = dbUser.id;
    chatSendMsg.userName = dbUser.name;
    BackMessage.send('chat', chatSendMsg);
}