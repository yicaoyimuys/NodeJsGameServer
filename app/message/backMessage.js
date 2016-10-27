/**
 * Created by egret on 16/1/22.
 */

var Utils = require('../../libs/util/utils.js');
var Log = require('../../libs/log/log.js');
var Server = require('../../libs/config/server.js');
var Global = require('../../libs/global/global.js');
var Session = require('../../libs/session/session.js');
var SystemProto = require('../proto/systemProto.js');
var GameProto = require('../proto/gameProto.js');
var Handle = require('./backMessageHandle.js');

var BackMessage = module.exports;

BackMessage.receive = function(session, msg) {
    var data = SystemProto.decode(msg);
    var handle = Handle.handles[data.msgId];
    //Log.debug('BackMessage收到消息ID：' + data.msgId);
    if(handle){
        Utils.invokeCallback(handle, session, data);
    } else {
        Log.error('BackMessage收到未处理的消息ID: ' + data.msgId);
    }
}

function send(server, msg) {
    if(!server){
        return;
    }

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

BackMessage.sendToGate = function(userSession, sendMsg) {
    var msg = new SystemProto.system_sendToGate();
    msg.userSessionID = userSession.id;
    msg.msgBody = sendMsg.encode();
    send(userSession.session, msg);
}

BackMessage.sendToGateByAll = function(sendMsg) {
    var msg = new SystemProto.system_sendToGateByAll();
    msg.msgBody = sendMsg.encode();
    send('gate', msg);
}

BackMessage.sendToGateByList = function(sessionList, sendMsg) {
    var msg = new SystemProto.system_sendToGateByList();
    msg.userSessionList = sessionList;
    msg.msgBody = sendMsg.encode();
    send('gate', msg);
}

BackMessage.sendErrorCode = function(userSession, errorCode) {
    var errorMsg = new GameProto.error_notice_s2c();
    errorMsg.errorCode = errorCode;
    BackMessage.sendToGate(userSession, errorMsg);
}

BackMessage.sendToGame = function(gameServerName, sendMsg) {
    send(Global[gameServerName], sendMsg);
}

BackMessage.sendToWorld = function(sendMsg) {
    var msg = new SystemProto.system_sendToWorld();
    msg.msgBody = sendMsg.encode();
    send('world', msg);
}

BackMessage.sendToChat = function(sendMsg) {
    send('chat', sendMsg);
}

BackMessage.sendToLogin = function(sendMsg) {
    send('login', sendMsg);
}

BackMessage.send = function(session, sendMsg) {
    send(session, sendMsg);
}