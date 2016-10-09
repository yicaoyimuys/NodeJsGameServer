/**
 * Created by egret on 16/3/10.
 */
var ChatService = module.exports;

var Log = require('../../libs/log/log.js');
var ChatUser = require('../model/chatUser.js');

var Users = {};
var UserNames = {};
var UserSessions = {};

var Chan_World = [];

ChatService.addUser = function(userSessionId, userId, userName){
    var user = new ChatUser();
    user.id = userId;
    user.name = userName;
    user.sessionId = userSessionId;

    Users[userId] = user;
    UserNames[userName] = userId;
    UserSessions[userSessionId] = userId;

    Chan_World.push(userId);
    Log.debug('Chat AddUser：' + Chan_World.length);
}

ChatService.removeUser = function(userSessionId){
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
}

ChatService.getUserById = function(userId) {
    return Users[userId];
}

ChatService.getUserBySession = function(userSessionId) {
    var userId = UserSessions[userSessionId];
    if(!userId){
        return null;
    }

    return Users[userId];
}
