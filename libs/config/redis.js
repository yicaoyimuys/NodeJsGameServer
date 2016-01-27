/**
 * Created by egret on 16/1/26.
 */
var Redis = module.exports;
var RedisConfig = require('../../config/redis.json');

Redis.get = function() {
    return RedisConfig;
}