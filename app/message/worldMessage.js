/**
 * Created by egret on 16/1/22.
 */

var Utils = require('../../libs/util/utils.js');
var Log = require('../../libs/log/log.js');
var Server = require('../../libs/config/server.js');
var Proto = require('../proto/systemProto.js');
var Handle = require('./worldMessageHandle.js');

var WorldMessage = module.exports;

WorldMessage.receive = function(session, data) {
    var receiveBuff = data.msgBody;
    var receiveMsg = Proto.decode(receiveBuff);

    var handle = Handle.handles[receiveMsg.msgId];
    Log.debug('WorldMessage收到消息ID：' + receiveMsg.msgId);

    if(handle){
        handle(receiveMsg, session);
    } else {
        Log.error('WorldMessage收到未处理的消息ID: ' + receiveMsg.msgId);
    }
}