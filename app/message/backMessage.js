/**
 * Created by egret on 16/1/22.
 */

var Utils = require('../../libs/util/utils.js');
var Log = require('../../libs/log/log.js');

function BackMessage (){
    this.handles = {};
}

BackMessage.prototype.addHandle = function(msgId, handleFunc) {
    this.handles[msgId] = handleFunc;
}

BackMessage.prototype.receive = function(session, msg) {
    //Log.debug('BackMessage收到消息：' + msg.toString());

    var data = JSON.parse(msg.toString());
    var handle = this.handles[data.msgId];
    if(handle){
        Utils.invokeCallback(handle, session, data.msgBody);
    } else {
        Log.error('BackMessage收到未处理的消息ID: ' + data.msgId);
    }
}

BackMessage.send = function(session, msgId, msgBody) {
    if(!session){
        Log.error('BackMessage session is not exists')
        return;
    }

    var msg = {
        'msgId' : msgId,
        'msgBody' : msgBody
    }
    session.send(JSON.stringify(msg));
}

module.exports = BackMessage;