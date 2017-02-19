/**
 * Created by egret on 16/3/10.
 */
var ChatDataService = module.exports;

var Log = require('../../libs/log/log.js');
var ChatUser = require('../model/chatUser.js');

var Users = {};
var UserNames = {};
var UserSessions = {};

var Chan_World = [];

ChatDataService.addUser = function(userSessionId, userId, userName, unionId){
    var user = new ChatUser();
    user.id = userId;
    user.name = userName;
    user.sessionId = userSessionId;
    user.unionId = unionId;

    Users[userId] = user;
    UserNames[userName] = userId;
    UserSessions[userSessionId] = userId;

    Chan_World.push(userId);
    Log.debug('Chat AddUser：' + Chan_World.length);
}

ChatDataService.removeUser = function(userSessionId){
    var userId = UserSessions[userSessionId];
    if(!userId){
        return;
    }

    var userName = Users[userId].name;
    delete Users[userId];
    delete UserNames[userName];
    delete UserSessions[userSessionId];

    Chan_World.splice(Chan_World.indexOf(userId), 1);
    Log.debug('Chat RemoveUser：' + Chan_World.length);
    Log.debug('下线了。。。。。 ' + userId);
}

ChatDataService.getUserById = function(userId) {
    return Users[userId];
}

ChatDataService.getUserBySession = function(userSessionId) {
    var userId = UserSessions[userSessionId];
    if(!userId){
        return null;
    }

    return Users[userId];
}
