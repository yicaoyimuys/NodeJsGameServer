/**
 * Created by egret on 16/2/2.
 */

var Log = require('../../libs/log/log.js');

var GameDataService = module.exports;

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

GameDataService.getUserBySession = function(sessionId){
    var userId = UserSessions[sessionId];
    if(userId){
        return GameDataService.getUser(userId);
    }
    return null;
}
