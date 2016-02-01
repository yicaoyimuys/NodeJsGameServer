/**
 * Created by egret on 16/1/22.
 */

var Utils = require('../../libs/util/utils.js');
var Log = require('../../libs/log/log.js');
var Server = require('../../libs/config/server.js');
var Proto = require('../proto/gameProto.js');
var Handle = require('./gameMessageHandle.js');

var GameMessage = module.exports;

GameMessage.receive = function(receiveBuff, cb) {
    var receiveMsg = Proto.decode(receiveBuff);
    var handle = Handle.handles[receiveMsg.msgId];
    Log.debug('GameMessage收到消息ID：' + receiveMsg.msgId);
    if(handle){
        handle(receiveMsg, function(sendMsg){
            Utils.invokeCallback(cb, sendMsg.encode());
        });
    } else {
        Log.error('GameMessage收到未处理的消息ID: ' + receiveMsg.msgId);
    }
}