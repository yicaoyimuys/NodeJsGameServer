/**
 * Created by egret on 16/2/1.
 */
var Mysql = require('mysql');
var Global = require('../../../libs/global/global.js');
var Log = require('../../../libs/log/log.js');
var Utils = require('../../../libs/util/utils.js');

function SqlAsync(key){
    this.key = key;
}

SqlAsync.prototype.query = function(sql, values){
    var key = this.key;
    var sqlStr = Mysql.format(sql, values);
    Log.debug(sqlStr);
    Global.redis.rpush(key, sqlStr, function(err){
        if(err){
            Log.error(sqlStr + ": " + err);
        }
    });
};

SqlAsync.prototype.getAll = function(cb){
    var key = this.key;
    Global.redis.lrange(key, 0, -1, function(err, datas){
        if(err){
            Log.error("SqlAsync.getAll: " + err);
            Utils.invokeCallback(cb, []);
            return;
        }
        Global.redis.ltrim(key, datas.length, -1);
        Utils.invokeCallback(cb, datas);
    });
}

module.exports = SqlAsync;