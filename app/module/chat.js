/**
 * Created by egret on 16/10/8.
 */
var Chat = module.exports;

var Consts = require('../comm/consts.js');
var ErrCode = require('../comm/errCode.js');
var ChatDataService = require('../data/chatDataService.js');
var Rpc = require('../message/rpc.js');
var GameProto = require('../proto/gameProto.js');
var RpcProto = require('../proto/rpcProto.js');
var UserSession = require('../../libs/session/userSession.js');
var UserSessionService = require('../../libs/session/userSessionService.js');
var Global = require('../../libs/global/global.js');
var Server = require('../../libs/config/server.js');
var MyDate = require('../../libs/date/date.js');
var Log = require('../../libs/log/log.js');
var Timer = require('../../libs/timer/timer.js');
var Common = require('./common.js');

var chatMessages = [];
var dealMessageSpace = 100;

function init(){
    Timer.setInterval(dealMessageSpace, dealMessage);
}

function dealMessage(){
    var msgNum = chatMessages.length;
    if(msgNum == 0){
        return;
    }

    var dealNum = Math.ceil(msgNum/(1000/dealMessageSpace));
    for(var i=0; i<dealNum; i++){
        var sendMsg = chatMessages.shift();
        Rpc.notifyClientByAll(sendMsg);
    }
    Log.debug('处理消息' + dealNum + ' 剩余聊天信息: '+(msgNum-dealNum));
}

init();

Chat.addUser = function(userSessionId, userConnectorServer, userId, userName, unionId, callBack) {
    ChatDataService.addUser(userSessionId, userId, userName, unionId);

    var userSession = new UserSession(userSessionId, Global[userConnectorServer]);
    userSession.addCloseCallBack(function(){
        ChatDataService.removeUser(userSessionId);
    });
    UserSessionService.addSession(userSession);

    callBack(new RpcProto.rpc_userJoinChat_s2c());
}

Chat.removeUser = function(userSessionId){
    var userSession = UserSessionService.getSession(userSessionId);
    userSession && userSession.close();
}

Chat.talk = function (userSession, chatMsg, channel) {
    //聊天内容长度控制
    if(chatMsg.length > Consts.CHAT_MAX_LEN){
        Common.sendErrorCode(userSession, ErrCode.ERR_CHAT_OVER_LEN);
        return;
    }

    //频道检测
    if(channel != Consts.CHAT_CHANNEL_WORLD) {
        Common.sendErrorCode(userSession, ErrCode.ERR_CHAT_CHANNEL);
        return;
    }

    //检测用户是否存在
    var user = ChatDataService.getUserBySession(userSession.id);
    if(!user){
        Common.sendErrorCode(userSession, ErrCode.ERR_CHAT_NO_USER);
        return;
    }

    //检测聊天发送是否过频
    var nowTime = MyDate.unix();
    if(user.lastTalkTime != 0 && nowTime - user.lastTalkTime < Consts.CHAT_MIN_TIME){
        Common.sendErrorCode(userSession, ErrCode.ERR_CHAT_OVER_FRE);
        return;
    }
    user.lastTalkTime = nowTime;

    //屏蔽字过滤

    //消息发送
    var sendMsg = new GameProto.user_chat_s2c();
    sendMsg.chatMsg = chatMsg;
    sendMsg.fUserId = user.id;
    sendMsg.fUserName = user.name;
    sendMsg.channel = channel;
    chatMessages.push(sendMsg);
}