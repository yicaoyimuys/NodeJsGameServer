/**
 * Created by egret on 16/1/26.
 */

var User = module.exports;

var Global = require('../../libs/global/global.js');
var Utils = require('../../libs/util/utils.js');
var UserSession = require('../../libs/session/userSession.js');
var DbUserModel = require('../model/dbUser.js');
var UserModel = require('../model/user.js');
var DataService = require('../data/dataService.js');
var UserDao = require('../dao/userDao.js');
var Proto = require('../proto/gameProto.js');
var Log = require('../../libs/log/log.js');
var MyDate = require('../../libs/date/date.js');
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
    var dbUser = new DbUserModel();
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
    //在Redis中缓存用户数据
    dbUser.last_login_time = MyDate.unix();
    UserCache.setUser(dbUser);
    UserDao.updateUserLoginTime(dbUser);

    //返回客户端消息
    var sendMsg = new Proto.user_login_s2c();
    sendMsg.user.userId = dbUser.id;
    sendMsg.user.userName = dbUser.name;
    sendMsg.user.money = dbUser.money;
    sendMsg.user.create_time = dbUser.create_time;
    sendMsg.user.task = [1, 2, 3, 8, 9];
    Utils.invokeCallback(cb, sendMsg);
}

User.joinGame = function(userId, cb, userSessionID){
    UserCache.getUserById(userId, function(cacheDbUser){
        if(cacheDbUser){
            //在内存中缓存用户数据
            var user = new UserModel();
            user.dbUser = cacheDbUser;
            user.session = new UserSession(userSessionID);
            DataService.addUser(user);

            //返回客户端消息
            var sendMsg = new Proto.user_joinGame_s2c();
            sendMsg.user.userId = cacheDbUser.id;
            sendMsg.user.userName = cacheDbUser.name;
            sendMsg.user.money = cacheDbUser.money;
            sendMsg.user.create_time = cacheDbUser.create_time;
            sendMsg.user.task = [9, 8, 3, 2];
            Utils.invokeCallback(cb, sendMsg);
        } else {
            Log.error('不存在用户缓存数据')
        }
    });
}