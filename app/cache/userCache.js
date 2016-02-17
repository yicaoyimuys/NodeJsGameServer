/**
 * Created by egret on 16/1/27.
 */

var UserCache = module.exports;

var Global = require('../../libs/global/global.js');
var Log = require('../../libs/log/log.js');
var Utils = require('../../libs/util/utils.js');
var MyDate = require('../../libs/date/date.js');
var Async = require('async');

var USER_KEY = 'User_';
var USER_NAME_KEY = 'User_Name_';
var USER_OFFLINE_KEY = 'User_Offline_';

UserCache.setUser = function(dbUser){
    Global.redis.mset(USER_KEY + dbUser.id, JSON.stringify(dbUser), USER_NAME_KEY + dbUser.name, dbUser.id);
}

UserCache.getUserByName = function(userName, callback){
    Async.waterfall([
        function(cb){
            Global.redis.get(USER_NAME_KEY + userName, cb);
        },
        function(userId, cb){
            Global.redis.get(USER_KEY + userId, cb);
        },
        function(dbUser, cb){
            Utils.invokeCallback(callback, JSON.parse(dbUser));
            cb(null);
        }
    ], function(err){
        if(err){
            Log.error('UserCache.getUserByName：' + err);
            Utils.invokeCallback(callback, null);
        }
    });
}

UserCache.getUserById = function(userId, callback){
    Global.redis.get(USER_KEY + userId, function (err, reply) {
        if(err){
            Log.error('UserCache.getUserById：' + err);
            Utils.invokeCallback(callback, null);
        }
        else{
            Utils.invokeCallback(callback, JSON.parse(reply));
        }
    });
}

UserCache.setOnline = function(userId){
    Global.redis.hdel(USER_OFFLINE_KEY, userId);
}

UserCache.setOffline = function(userId){
    var nowTime = MyDate.unix();
    Global.redis.hset(USER_OFFLINE_KEY, userId, nowTime);
}

UserCache.getAllOfflineUser = function(callback){
    Global.redis.hgetall(USER_OFFLINE_KEY, function (err, obj) {
        if(err){
            Log.error('UserCache.getAllOfflineUser：' + err);
        }
        else{
            Utils.invokeCallback(callback, obj);
        }
    });
}

UserCache.removeOfflineUser = function(removeUsers){
    if(removeUsers.length == 0){
        return;
    }

    Global.redis.hdel(USER_OFFLINE_KEY, removeUsers);
    for(var i=0, len=removeUsers.length; i<len; i++){
        removeUsers[i] = USER_KEY + removeUsers[i];
    }
    Global.redis.del(removeUsers);
}

