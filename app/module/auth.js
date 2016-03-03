/**
 * Created by egret on 16/2/25.
 */
var Auth = module.exports;

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


Auth.login = function(account, cb, userSessionID) {
    UserCache.getUserByName(account, function(cacheDbUser){
        if(cacheDbUser){
            Auth.loginSuccess(cacheDbUser, cb, userSessionID);
            Log.debug('存在缓存')
        } else {
            UserDao.getUserByName(account, function(err, dbUser){
                if (err){
                    Log.error(err);
                } else {
                    if (dbUser) {
                        Auth.loginSuccess(dbUser, cb, userSessionID);
                    } else{
                        Auth.create(account, cb, userSessionID);
                    }
                }
            })
        }
    });
}

Auth.create = function(account, cb, userSessionID) {
    var dbUser = new DbUserModel();
    dbUser.name = account;
    dbUser.money = Math.ceil(Math.random() * 10000);
    UserDao.createUser(dbUser, function(err, dbUser){
        if (err){
            Log.error(err);
        } else {
            Auth.loginSuccess(dbUser, cb, userSessionID);
        }
    })
}

Auth.loginSuccess = function(dbUser, cb, userSessionID){
    //在Redis中缓存用户数据
    dbUser.last_login_time = MyDate.unix();
    UserCache.setUser(dbUser);

    //在内存中缓存用户数据
    var user = new UserModel();
    user.dbUser = dbUser;
    user.session = new UserSession(userSessionID);
    user.session.addCloseCallBack(function(){
        //设置用户下线
        UserCache.setOffline(dbUser.id);
    });
    DataService.addUser(user);

    //设置用户在线
    UserCache.setOnline(dbUser.id);

    //返回客户端消息
    var sendMsg = new Proto.user_login_s2c();
    sendMsg.user.userId = dbUser.id;
    sendMsg.user.userName = dbUser.name;
    sendMsg.user.money = dbUser.money;
    sendMsg.user.create_time = dbUser.create_time;
    sendMsg.user.task = [1, 2, 3, 8, 9];
    Utils.invokeCallback(cb, sendMsg);
}
