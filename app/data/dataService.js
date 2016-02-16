/**
 * Created by egret on 16/2/2.
 */

var Log = require('../../libs/log/log.js');

var DataService = module.exports;

var Users = {};
var UserSessions = {};

DataService.addUser = function(user){
    var userId = user.dbUser.id;
    var userSessionId = user.session.id;
    Users[userId] = user;
    UserSessions[userSessionId] = userId;

    user.session.addCloseCallBack(function(){
        Users[userId] = null;
        UserSessions[userSessionId] = null;
        //Log.info('下线了。。。。。 ' + userId);
    });
}

DataService.getUser = function(userId){
    return Users[userId];
}

DataService.getUserBySession = function(sessionId){
    var userId = UserSessions[sessionId];
    if(userId){
        return DataService.getUser(userId);
    }
    return null;
}
