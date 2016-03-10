/**
 * Created by egret on 16/1/26.
 */
var Redis = module.exports;

var Global = require('../global/global.js');
var RedisConfig = require('../../config/redis.json');

Redis.get = function() {
    return RedisConfig[Global.environment];
}