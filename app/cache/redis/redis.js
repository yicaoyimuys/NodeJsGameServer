/**
 * Created by egret on 16/1/27.
 */

var Redis = require("redis");

var Log = require('../../../libs/log/log.js');
var Utils = require('../../../libs/util/utils.js');

function RedisClient(config){
    var client = Redis.createClient(config);
    client.on("connect", function () {
        Log.info('redis connect success...');
        client.select(config.db);
    });
    client.on("error", function (err) {
        Log.error('redis connect fail：' + err);
    });
    return client;
}

module.exports = RedisClient;