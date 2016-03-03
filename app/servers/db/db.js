/**
 * Created by egret on 16/2/1.
 */
var Startup = require('../../startup.js');
var UserCache = require('../../cache/userCache.js');
var DbUpdateCache = require('../../cache/dbUpdateCache.js');
var UserDao = require('../../dao/userDao.js');
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
Startup.connectBack(logServerConfig);
Timer.setTimeout(2000, start);

function start(){
    syncDb();
    dealOfflineUser();
    Timer.setInterval(dbServerConfig.syncdb_interval * 1000, syncDb);
    Timer.setInterval(dbServerConfig.dealOfflineUser_interval * 1000, dealOfflineUser);
}

var syncDbNextInterval = 10;//间隔10毫秒检测
var syncDbMaxQueue = 10;//最大处理10条操作
var syncDbQueue = 0;
var syncDbStartTime = 0;
var updateDatas = [];
function syncDb(){
    syncDbStartTime = Date.now();
    DbUpdateCache.getAll(function(datas){
        //排除重复
        var datasLen = datas.length;
        Log.info('start syncDb：' + datasLen + ' ...');
        for(var i=0; i<datasLen; i++){
            var tmp = datas[i];
            if(updateDatas.indexOf(tmp) == -1){
                updateDatas.push(tmp);
            }
        }

        Log.info('start syncDb true：' + updateDatas.length + ' ...');
        syncDbNext();

    })
}

function syncDbNext(){
    //已完成
    if(updateDatas.length == 0){
        Log.info('syncDb success, time：' + (Date.now() - syncDbStartTime) + 'ms');
        return;
    }

    //此次要处理的条数
    var dealCount = syncDbMaxQueue - syncDbQueue;
    if(dealCount <= 0){
        Timer.setTimeout(syncDbNextInterval, syncDbNext);
        return;
    }

    //此次要处理的数据
    var datas = updateDatas.splice(0, dealCount);
    syncDbQueue = syncDbMaxQueue;

    var successCallback = function(){
        syncDbQueue--;
    }
    for(var i= 0, len=datas.length; i<len; i++){
        var value = datas[i];
        var arr = value.split("_");
        var userId = arr[0];
        var updateType = arr[1];
        switch (updateType){
            case DbUpdateCache.UPDATE_USER_TYPE:
                UserDao.update(userId, successCallback);
                break;
            default:
                Log.error('不存在的DbUpdateKey');
                break;
        }
    }

    //开启下次处理
    Timer.setTimeout(syncDbNextInterval, syncDbNext);
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