/**
 * Created by egret on 16/1/22.
 */

var Log = require('../../libs/log/log.js');
var Server = require('../../libs/config/server.js');
var Global = require('../../libs/global/global.js');
var SystemProto = require('../proto/systemProto.js');
var GameProto = require('../proto/gameProto.js');
var Message = require('./message.js');
var BackMessage = require('./backMessage.js');

var FrontMessage = module.exports;

FrontMessage.receive = function(session, receiveBuff) {
    //根据msgId发送消息到不同的服务器
    var msgId = receiveBuff.readUInt16BE(0);
    Log.debug('FrontMessage收到消息ID：' + msgId);

    //封装发送到后台服务器的消息
    var sendMsg = new SystemProto.system_gateDispatch();
    sendMsg.userSessionID = session.id;
    sendMsg.msgBody = receiveBuff;

    //消息分发
    if(Message.isLoginMsg(msgId)){
        //登陆服务器消息
        BackMessage.send('login', sendMsg);
    }
    else if(Message.isChatMsg(msgId)){
        //聊天服务器消息
        BackMessage.send('chat', sendMsg);
    }
    else if(Message.isGameMsg(msgId)){
        //分配游戏服务器
        if(msgId == GameProto.ID_user_joinGame_c2s){
            Global.allotGameServer(session);
            if(!session.gameServer){
                Log.error('没有可分配的gameServer');
                return;
            }
        }
        //游戏服务器消息
        BackMessage.send(Global[session.gameServer], sendMsg);
    }
    else {
        Log.error('FrontMessage收到未处理的消息ID: ' + data.msgId);
    }
}

FrontMessage.send = function(session, sendBuff) {
    if(!session){
        Log.error('FrontMessage session is not exists');
        return;
    }

    session.send(sendBuff);
}