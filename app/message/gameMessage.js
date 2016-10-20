/**
 * Created by egret on 16/1/22.
 */

var Utils = require('../../libs/util/utils.js');
var Log = require('../../libs/log/log.js');
var Server = require('../../libs/config/server.js');
var UserSession = require('../../libs/session/userSession.js');
var UserSessionService = require('../../libs/session/userSessionService.js');
var Proto = require('../proto/gameProto.js');
var Handle = require('./gameMessageHandle.js');

var GameMessage = module.exports;

GameMessage.receive = function(session, data) {
    var receiveBuff = data.msgBody;
    var userSessionID = data.userSessionID;
    var receiveMsg = Proto.decode(receiveBuff);
    var handle = Handle.handles[receiveMsg.msgId];
    Log.debug('GameMessage收到消息ID：' + receiveMsg.msgId);

    var userSession = null;
    if(receiveMsg.msgId == Proto.ID_user_login_c2s){
        userSession = new UserSession(userSessionID, session);
    } else {
        userSession = UserSessionService.getSession(userSessionID);
    }

    if(!userSession){
        Log.error('GameMessage收到非法的消息');
        return;
    }

    if(handle){
        handle(userSession, receiveMsg);
    } else {
        Log.error('GameMessage收到未处理的消息ID: ' + receiveMsg.msgId);
    }
}