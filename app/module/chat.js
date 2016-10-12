/**
 * Created by egret on 16/10/8.
 */
var Chat = module.exports;

var Consts = require('../comm/consts.js');
var ErrCode = require('../comm/errCode.js');
var ChatService = require('../data/chatService.js');
var BackMessage = require('../message/backMessage.js');
var GameProto = require('../proto/gameProto.js');
var UserSession = require('../../libs/session/userSession.js');
var UserSessionService = require('../../libs/session/userSessionService.js');
var Global = require('../../libs/global/global.js');
var Server = require('../../libs/config/server.js');
var MyDate = require('../../libs/date/date.js');
var Log = require('../../libs/log/log.js');

Chat.addUser = function(userSessionId, userId, userName, unionId) {
    ChatService.addUser(userSessionId, userId, userName, unionId);

    var userSession = new UserSession(userSessionId, Global[Server.getByServer('gate').id]);
    userSession.addCloseCallBack(function(){
        ChatService.removeUser(userSessionId);
    });
    UserSessionService.addSession(userSession);
}

Chat.removeUser = function(userSessionId){
    var userSession = UserSessionService.getSession(userSessionId);
    userSession && userSession.close();
}

Chat.talk = function (userSession, chatMsg, channel) {
    //聊天内容长度控制
    if(chatMsg.length > Consts.CHAT_MAX_LEN){
        BackMessage.sendErrorCode(userSession, ErrCode.ERR_CHAT_OVER_LEN);
        return;
    }

    //频道检测
    if(channel != Consts.CHAT_CHANNEL_WORLD) {
        BackMessage.sendErrorCode(userSession, ErrCode.ERR_CHAT_CHANNEL);
        return;
    }

    //检测用户是否存在
    var user = ChatService.getUserBySession(userSession.id);
    if(!user){
        BackMessage.sendErrorCode(userSession, ErrCode.ERR_CHAT_NO_USER);
        return;
    }

    //检测聊天发送是否过频
    var nowTime = MyDate.unix();
    if(user.lastTalkTime != 0 && nowTime - user.lastTalkTime < Consts.CHAT_MIN_TIME){
        BackMessage.sendErrorCode(userSession, ErrCode.ERR_CHAT_OVER_FRE);
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
    BackMessage.sendToGateByAll(userSession, sendMsg);
}