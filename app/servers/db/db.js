/**
 * Created by egret on 16/2/1.
 */
var Startup = require('../../startup.js');
var UserCache = require('../../cache/userCache.js');
var Server = require('../../../libs/config/server.js');
var Log = require('../../../libs/log/log.js');
var Timer = require('../../../libs/timer/timer.js');
var Global = require('../../../libs/global/global.js');
var MyDate = require('../../../libs/date/date.js');
var Async = require('async');

var dbServerConfig = Server.getByServer('db');
var logServerConfig = Server.getByServer('log');

Startup.init(dbServerConfig.id);
Startup.initRedis();
Startup.initUseDb();
Startup.initAsyncUserDb();
Startup.connectBack(logServerConfig);
Timer.setTimeout(2000, start);

function start(){
    syncDb();
    dealOfflineUser();
    Timer.setInterval(dbServerConfig.syncdb_interval * 1000, syncDb);
    Timer.setInterval(dbServerConfig.dealOfflineUser_interval * 1000, dealOfflineUser);
}

function syncDb(){
    Global.asyncUserDb.getAll(function(datas){
        Log.info('start syncDb：' + datas.length);
        Async.forEachOf(datas, function (value, key, callback) {
            Global.userDb.query(value, null, function(err){
                if(err){
                    Log.error('syncDb：' + err);
                }
                callback();
            });

        }, function (err) {
            Log.info('syncDb success：' + datas.length);
        })
    });
}

//下线超过3小时的用户，清除redis中的缓存数据
var USER_MAX_OFFLINETIME = 3 * 60 * 60;
function dealOfflineUser(){
    UserCache.getAllOfflineUser(function(obj){
        if(!obj){
            obj = {};
        }

        var removeUsers = [];
        var nowTime = MyDate.unix();
        var keys = Object.keys(obj);
        Log.info('start dealOfflineUser：' + keys.length);
        for(var i=0, len=keys.length; i<len; i++){
            var key = keys[i];
            var value = obj[key];
            if(nowTime - value > USER_MAX_OFFLINETIME){
                removeUsers.push(key);
            }
        }

        UserCache.removeOfflineUser(removeUsers);
        Log.info('dealOfflineUser success：' + removeUsers.length);
    });
}