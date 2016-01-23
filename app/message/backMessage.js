/**
 * Created by egret on 16/1/22.
 */

var Utils = require('../../libs/util/utils.js');
var Log = require('../../libs/log/log.js');
var Server = require('../../libs/server/server.js');
var Global = require('../../libs/global/global.js');
var Session = require('../../libs/session/session.js');
var Proto = require('../proto/proto.js');

function BackMessage (){
    this.handles = {};
}

BackMessage.prototype.addHandle = function(msgId, handleFunc) {
    this.handles[msgId] = handleFunc;
}

BackMessage.prototype.receive = function(session, msg) {
    //Log.debug('BackMessage收到消息：' + msg.toString());

    var data = Proto.decode(msg);
    var handle = this.handles[data.msgId];
    if(handle){
        Utils.invokeCallback(handle, session, data);
    } else {
        Log.error('BackMessage收到未处理的消息ID: ' + data.msgId);
    }
}

BackMessage.send = function(server, msg) {
    var session = null;
    if(server instanceof Session){
        session = server;
    } else {
        session = Global[Server.getByServer(server).id];
    }

    if(!session){
        Log.error('BackMessage session is not exists');
        return;
    }

    session.send(msg.encode());
}

module.exports = BackMessage;