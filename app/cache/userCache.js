/**
 * Created by egret on 16/1/27.
 */

var UserCache = module.exports;

var Global = require('../../libs/global/global.js');
var Log = require('../../libs/log/log.js');
var Utils = require('../../libs/util/utils.js');
var Async = require('async');

var USER_KEY = 'User_';
var USER_NAME_KEY = 'User_Name_';

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