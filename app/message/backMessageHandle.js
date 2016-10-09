/**
 * Created by yangsong on 16/1/24.
 */
var Global = require('../../libs/global/global.js');
var SessionService = require('../../libs/session/sessionService.js');
var UserSessionService = require('../../libs/session/userSessionService.js');
var Chat = require('../module/chat.js');
var Log = require('../../libs/log/log.js');
var Proto = require('../proto/systemProto.js');
var BackMessage = require('./backMessage.js');
var FrontMessage = require('./frontMessage.js');
var GameMessage = require('./gameMessage.js');

var BackMessageHandle = module.exports;

BackMessageHandle.handles = {};
BackMessageHandle.handles[Proto.ID_system_helloServer] = Global.addServerClient;

/***Game Chat Login收到的消息处理 Start**/
BackMessageHandle.handles[Proto.ID_system_gateDispatch] = function(session, data) {
    GameMessage.receive(session, data);
}
BackMessageHandle.handles[Proto.ID_system_clientOffline] = function(session, data) {
    var userSession = UserSessionService.getSession(data.userSessionID);
    userSession && userSession.close();
}
BackMessageHandle.handles[Proto.ID_system_chatAddUser] = function(session, data) {
    Chat.addUser(data.userSessionID, data.userId, data.userName);
}
/***Game Chat Login收到的消息处理 End**/



/***Gate收到的消息处理 Start**/
BackMessageHandle.handles[Proto.ID_system_sendToGate] = function(session, data) {
    var userSession = SessionService.getSession(data.userSessionID);
    FrontMessage.send(userSession, data.msgBody);
}
BackMessageHandle.handles[Proto.ID_system_sendToGateByList] = function(session, data) {
    var list = data.userSessionList;
    for (var i=0, len=list.length; i<len; i++) {
        var userSession = SessionService.getSession(list[i]);
        FrontMessage.send(userSession, data.msgBody);
    }
}
BackMessageHandle.handles[Proto.ID_system_sendToGateByAll] = function(session, data) {
    var sessions = SessionService.getAllSession();
    for (var sessionId in sessions){
        var userSession = sessions[sessionId];
        FrontMessage.send(userSession, data.msgBody);
    }
}
/***Gate收到的消息处理 End**/