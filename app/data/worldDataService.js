/**
 * Created by egret on 16/2/2.
 */

var WorldDataService = module.exports;

var Log = require('../../libs/log/log.js');

var Users = {};

WorldDataService.addUser = function(user, userSession){
    var userId = user.id;
    Users[userId] = user;

    userSession.addCloseCallBack(function(){
        Users[userId] = null;
        Log.debug('下线了。。。。。 ' + userId);
    });
}

WorldDataService.getUser = function(userId){
    return Users[userId];
}
