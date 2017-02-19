/**
 * Created by egret on 16/2/2.
 */

var Log = require('../../libs/log/log.js');

var GameDataService = module.exports;

var UserSessionService = require('../../libs/session/userSessionService.js');

var Users = {};
var UserNames = {};
var UserSessions = {};

GameDataService.addUser = function(user, userSession){
    var userId = user.id;
    var userName = user.name;
    var userSessionId = user.sessionId;
    Users[userId] = user;
    UserNames[userName] = userId;
    UserSessions[userSessionId] = userId;

    userSession.addCloseCallBack(function(){
        Users[userId] = null;
        UserNames[userName] = null;
        UserSessions[userSessionId] = null;

        delete Users[userId];
        delete UserNames[userName];
        delete UserSessions[userSessionId];
        Log.debug('下线了。。。。。 ' + userId);
    });
}

GameDataService.getUser = function(userId){
    return Users[userId];
}

GameDataService.getUserByName = function(userName){
    var userId = UserNames[userName];
    if(userId){
        return Users[userId];
    }
    return null;
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
