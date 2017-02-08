/**
 * Created by egret on 16/1/22.
 */

var Log = require('../../libs/log/log.js');
var GameProto = require('../proto/gameProto.js');
var Handle = require('./gateMessageHandle.js');

var GateMessage = module.exports;

GateMessage.receive = function(session, receiveBuff) {
    var receiveMsg = GameProto.decode(receiveBuff);

    var handle = Handle.handles[receiveMsg.msgId];
    Log.debug('GateMessage收到消息ID：' + receiveMsg.msgId);

    if(handle){
        handle(receiveMsg, session);
    } else {
        Log.error('GateMessage收到未处理的消息ID: ' + receiveMsg.msgId);
    }
}

GateMessage.send = function(session, sendBuff) {
    if(!session){
        Log.error('GateMessage session is not exists');
        return;
    }

    session.send(sendBuff);
}