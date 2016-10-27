/**
 * Created by egret on 16/2/2.
 */

var Log = require('../../libs/log/log.js');

var GameDataService = module.exports;

var UserSessionService = require('../../libs/session/userSessionService.js');

var Users = {};
var UserSessions = {};

GameDataService.addUser = function(user, userSession){
    var userId = user.id;
    var userSessionId = user.sessionId;
    Users[userId] = user;
    UserSessions[userSessionId] = userId;

    userSession.addCloseCallBack(function(){
        Users[userId] = null;
        UserSessions[userSessionId] = null;
        Log.debug('下线了。。。。。 ' + userId);
    });
}

GameDataService.getUser = function(userId){
    return Users[userId];
}

GameDataService.getUserSessionId = function(userId){
    var user = GameDataService.getUser(userId);
    if(user){
        return user.sessionId;
    }
    return null;
}

GameDataService.getUserSession = function(userId){
    var sessionId = GameDataService.getUserSessionId(userId);
    if(sessionId){
        return UserSessionService.getSession(sessionId);
    }
    return null;
}

GameDataService.getUserBySession = function(sessionId){
    var userId = UserSessions[sessionId];
    if(userId){
        return GameDataService.getUser(userId);
    }
    return null;
}
