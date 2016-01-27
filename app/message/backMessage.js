/**
 * Created by egret on 16/1/22.
 */

var Utils = require('../../libs/util/utils.js');
var Log = require('../../libs/log/log.js');
var Server = require('../../libs/config/server.js');
var Global = require('../../libs/global/global.js');
var Session = require('../../libs/session/session.js');
var Proto = require('../proto/proto.js');
var Handle = require('./backMessageHandle.js');

var BackMessage = module.exports;

BackMessage.receive = function(session, msg) {
    var data = Proto.decode(msg);
    var handle = Handle.handles[data.msgId];
    //Log.debug('BackMessage收到消息ID：' + data.msgId);
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