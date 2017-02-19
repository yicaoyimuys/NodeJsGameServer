/**
 * Created by egret on 16/2/25.
 */
var Auth = module.exports;

var Global = require('../../libs/global/global.js');
var Utils = require('../../libs/util/utils.js');
var UserSessionService = require('../../libs/session/userSessionService.js');
var DbUserModel = require('../model/dbUser.js');
var GameUser = require('../model/gameUser.js');
var GameDataService = require('../data/gameDataService.js');
var UserDao = require('../dao/userDao.js');
var RpcProto = require('../proto/rpcProto.js');
var GameProto = require('../proto/gameProto.js');
var Log = require('../../libs/log/log.js');
var MyDate = require('../../libs/date/date.js');
var UserCache = require('../cache/userCache.js');
var Rpc = require('../message/rpc.js');


Auth.login = function(userSession, account) {
    var existsUser = GameDataService.getUserByName(account);
    if(existsUser){
        Log.debug('重复登陆~');
        return;
    }
    UserCache.getUserByName(account, function(cacheDbUser){
        if(cacheDbUser){
            Auth.loginSuccess(userSession, cacheDbUser);
            Log.debug('存在缓存')
        } else {
            UserDao.getUserByName(account, function(err, dbUser){
                if (err){
                    Log.error(err);
                    Auth.loginFail(userSession);
                } else {
                    if (dbUser) {
                        Auth.loginSuccess(userSession, dbUser);
                    } else{
                        Auth.create(userSession, account);
                    }
                }
            })
        }
    });
}

Auth.create = function(userSession, account) {
    var dbUser = new DbUserModel();
    dbUser.name = account;
    dbUser.money = Math.ceil(Math.random() * 10000);
    dbUser.last_scene_id = 1;
    UserDao.createUser(dbUser, function(err, dbUser){
        if (err){
            Log.error(err);
            Auth.loginFail(userSession);
        } else {
            Auth.loginSuccess(userSession, dbUser);
        }
    })
}

Auth.loginFail = function(userSession){
    userSession.close();
}

Auth.loginSuccess = function(userSession, dbUser){
    var existsUser = GameDataService.getUser(dbUser.id);
    if(existsUser){
        Log.debug('重复登陆~');
        return;
    }

    //在Redis中缓存用户数据
    dbUser.last_login_time = MyDate.unix();
    UserCache.setUser(dbUser);

    //设置用户在线
    UserCache.setOnline(dbUser.id);
    userSession.addCloseCallBack(function(){
        //设置用户下线
        UserCache.setOffline(dbUser.id);
    });

    //通知WorldServer用户登录成功
    var onlineMsg = new RpcProto.rpc_userJoinWorld_c2s();
    onlineMsg.userId = dbUser.id;
    onlineMsg.userSessionId = userSession.id;
    onlineMsg.userConnectorServer = userSession.session.connectServerName;
    Rpc.call('world', onlineMsg, function(data){

        //在内存中缓存用户数据
        var gameUser = new GameUser();
        gameUser.id = dbUser.id;
        gameUser.name = dbUser.name;
        gameUser.sessionId = userSession.id;
        GameDataService.addUser(gameUser, userSession);
        UserSessionService.addSession(userSession);

        //返回通知客户端登录成功
        var sendMsg = new GameProto.user_login_s2c();
        sendMsg.user.userId = dbUser.id;
        sendMsg.user.userName = dbUser.name;
        sendMsg.user.money = dbUser.money;
        sendMsg.user.create_time = dbUser.create_time;
        sendMsg.user.task = dbUser.task || [9, 8, 3, 2];
        sendMsg.user.sceneId = dbUser.last_scene_id;
        Rpc.notifyClient(userSession, sendMsg);
    });
}


Auth.offline = function(data){
    var userSessionId = data.userSessionId;

    //在LoginServer下线
    var userSession = UserSessionService.getSession(userSessionId);
    userSession && userSession.close();

    //通知WorldServer用户下线
    var exitMsg = new RpcProto.rpc_userExitWorld_c2s();
    exitMsg.userSessionId = userSessionId;
    Rpc.notify('world', exitMsg);
}