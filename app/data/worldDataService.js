/**
 * Created by egret on 16/2/2.
 */

var WorldDataService = module.exports;

var Log = require('../../libs/log/log.js');

var Users = {};
var UserSessions = {};

WorldDataService.addUser = function(user, userSession){
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

WorldDataService.getUser = function(userId){
    return Users[userId];
}

WorldDataService.getUserBySession = function(sessionId){
    var userId = UserSessions[sessionId];
    if(userId){
        return WorldDataService.getUser(userId);
    }
    return null;
}
