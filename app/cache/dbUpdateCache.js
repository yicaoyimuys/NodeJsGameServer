/**
 * Created by egret on 16/2/25.
 */
var DbUpdateCache = module.exports;

var Global = require('../../libs/global/global.js');
var Log = require('../../libs/log/log.js');
var Utils = require('../../libs/util/utils.js');

var UPDATE_KEY = 'Update_';


DbUpdateCache.update = function(userId, updateType, args){
    var value = userId + "_" + updateType;
    if(args){
        for(var i=0,len=args.length; i<len; i++){
            value = value + "_" + args[i];
        }
    }
    Global.redis.rpush(UPDATE_KEY, value, function(err){
        if(err){
            Log.error("DbUpdateCache.update: " + err);
        }
    });
}

DbUpdateCache.getAll = function(callback){
    Global.redis.lrange(UPDATE_KEY, 0, -1, function(err, datas){
        if(err){
            Log.error("DbUpdateCache.getAll: " + err);
            Utils.invokeCallback(callback, []);
            return;
        }
        Global.redis.ltrim(UPDATE_KEY, datas.length, -1);
        Utils.invokeCallback(callback, datas);
    });
}

exports.UPDATE_USER_TYPE = 'updateUser';