/**
 * Created by yangsong on 16/1/24.
 */
var Global = require('../../libs/global/global.js');
var SessionService = require('../../libs/session/sessionService.js');
var UserSessionService = require('../../libs/session/userSessionService.js');
var Chat = require('../module/chat.js');
var User = require('../module/user.js');
var Auth = require('../module/auth.js');
var Log = require('../../libs/log/log.js');
var Proto = require('../proto/systemProto.js');
var BackMessage = require('./backMessage.js');
var FrontMessage = require('./frontMessage.js');
var GameMessage = require('./gameMessage.js');
var WorldMessage = require('./worldMessage.js');

var BackMessageHandle = module.exports;

BackMessageHandle.handles = {};
BackMessageHandle.handles[Proto.ID_system_helloServer] = Global.addServerClient;

/***Game Chat Login收到的消息处理 Start**/
BackMessageHandle.handles[Proto.ID_system_gateDispatch] = function(session, data) {
    GameMessage.receive(session, data);
}
/***Game Chat Login收到的消息处理 End**/


/***Login收到消息处理 Start***/
BackMessageHandle.handles[Proto.ID_system_clientOffline] = function(session, data) {
    Auth.offline(data);
}
/***Login收到消息处理 End***/


/***Chat收到消息处理 Start***/
BackMessageHandle.handles[Proto.ID_system_userJoinChat] = function(session, data) {
    Chat.addUser(data.userSessionId, data.userId, data.userName, data.unionId);
}
BackMessageHandle.handles[Proto.ID_system_userExitChat] = function(session, data) {
    Chat.removeUser(data.userSessionId);
}
/***Chat收到消息处理 End***/


/***Game收到消息处理 Start***/
BackMessageHandle.handles[Proto.ID_system_userJoinGame] = function(session, data) {
    User.addUser(data.userSessionId, data.userId, data.userName)
}
BackMessageHandle.handles[Proto.ID_system_userExitGame] = function(session, data) {
    User.removeUser(data.userSessionId);
}
/***Game收到消息处理 End***/


/***World收到消息处理 Start***/
BackMessageHandle.handles[Proto.ID_system_sendToWorld] = function(session, data) {
    WorldMessage.receive(session, data);
}
/***World收到消息处理 End***/


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