/**
 * Created by egret on 16/1/22.
 */

var Log = require('../../libs/log/log.js');
var Server = require('../../libs/server/server.js');
var Global = require('../../libs/global/global.js');
var Proto = require('../proto/proto.js');
var BackMessage = require('./backMessage.js');

var FrontMessage = module.exports;

FrontMessage.receive = function(session, msg) {
    //根据msgId发送消息到不同的服务器
    var msgId = msg.readUInt16BE(0);
    Log.debug('FrontMessage收到消息ID：' + msgId);

    //封装发送到后台服务器的消息
    var sendMsg = new Proto.system_gateDispatch();
    sendMsg.userSessionID = session.id;
    sendMsg.msgBody = msg;

    //消息分发
    if(msgId >= 1000 && msgId <= 1499){
        //登陆服务器消息
        BackMessage.send('login', sendMsg);
    }
    else if(msgId >= 1500 && msgId <= 1999){
        //聊天服务器消息
        BackMessage.send('chat', sendMsg);
    }
    else if(msgId >= 2000 && msgId <= 5999){
        //游戏服务器消息
        BackMessage.send(Global[session.gameServer], sendMsg);
    }
    else {
        Log.error('FrontMessage收到未处理的消息ID: ' + data.msgId);
    }
}

FrontMessage.send = function(session, msg) {
    if(!session){
        Log.error('FrontMessage session is not exists');
        return;
    }

    session.send(msg);
}