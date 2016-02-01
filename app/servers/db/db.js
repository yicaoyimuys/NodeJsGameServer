/**
 * Created by egret on 16/2/1.
 */
var Startup = require('../../startup.js');
var Server = require('../../../libs/config/server.js');
var Log = require('../../../libs/log/log.js');
var Timer = require('../../../libs/timer/timer.js');
var Global = require('../../../libs/global/global.js');
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
    Timer.setInterval(dbServerConfig.syncdb_interval * 1000, syncDb);
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