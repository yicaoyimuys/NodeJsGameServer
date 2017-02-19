/**
 * Created by egret on 16/1/22.
 */

var Log = require('../../libs/log/log.js');
var Server = require('../../libs/config/server.js');
var Global = require('../../libs/global/global.js');
var RpcProto = require('../proto/rpcProto.js');
var GameProto = require('../proto/gameProto.js');
var Message = require('./message.js');
var Rpc = require('./rpc.js');

var FrontMessage = module.exports;

FrontMessage.receive = function(session, receiveBuff) {
    //根据msgId发送消息到不同的服务器
    var msgId = receiveBuff.readUInt16BE(0);
    Log.debug('FrontMessage收到消息ID：' + msgId);

    //封装发送到后台服务器的消息
    var sendMsg = new RpcProto.rpc_gateDispatch_c2s();
    sendMsg.userSessionId = session.id;
    sendMsg.msgBody = receiveBuff;

    //消息分发
    if(Message.isLoginMsg(msgId)){
        //登陆服务器消息
        Rpc.notify('login', sendMsg);
    }
    else if(Message.isChatMsg(msgId)){
        //聊天服务器消息
        Rpc.notify('chat', sendMsg);
    }
    else if(Message.isGameMsg(msgId)){
        //游戏服务器消息
        if(msgId == GameProto.ID_user_joinScene_c2s){
            //绑定游戏服务器
            var msg = GameProto.decode(receiveBuff);
            var gameServer = Server.allotGameServer(msg.sceneId);
            if(session.gameServer == gameServer){
                Log.error('重复登录？？？？');
                return;
            }
            session.bindGameServer(gameServer);
        }
        //游戏服务器消息
        Rpc.notify(session.gameServer, sendMsg);
    }
    else {
        Log.error('FrontMessage收到未处理的消息ID: ' + msgId);
    }
}

FrontMessage.send = function(session, sendBuff) {
    if(!session){
        Log.error('FrontMessage session is not exists');
        return;
    }

    session.send(sendBuff);
}