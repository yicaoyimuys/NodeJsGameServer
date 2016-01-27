/**
 * Created by egret on 16/1/26.
 */

var User = module.exports;

var Global = require('../../libs/global/global.js');
var Utils = require('../../libs/util/utils.js');
var DbUser = require('../model/dbUser.js');
var UserDao = require('../dao/userDao.js');
var Proto = require('../proto/proto.js');
var Log = require('../../libs/log/log.js');
var UserCache = require('../cache/userCache.js');

User.login = function(account, cb) {
    UserCache.getUserByName(account, function(cacheDbUser){
        if(cacheDbUser){
            User.loginSuccess(cacheDbUser, cb);
            Log.debug('存在缓存')
        } else {
            UserDao.getUserByName(account, function(err, dbUser){
                if (err){
                    Log.error(err);
                } else {
                    if (dbUser) {
                        User.loginSuccess(dbUser, cb);
                    } else{
                        User.create(account, cb);
                    }
                }
            })
        }
    });
}

User.create = function(account, cb) {
    var dbUser = new DbUser();
    dbUser.name = account;
    dbUser.money = Math.ceil(Math.random() * 10000);
    UserDao.createUser(dbUser, function(err, dbUser){
        if (err){
            Log.error(err);
        } else {
            User.loginSuccess(dbUser, cb);
        }
    })
}

User.loginSuccess = function(dbUser, cb){
    UserCache.setUser(dbUser);

    var sendMsg = new Proto.user_login_s2c();
    sendMsg.user.userId = dbUser.id;
    sendMsg.user.userName = dbUser.name;
    sendMsg.user.money = dbUser.money;
    sendMsg.user.create_time = dbUser.create_time;
    sendMsg.user.task = [1, 2, 3, 8, 9];
    Utils.invokeCallback(cb, sendMsg);
}