/**
 * Created by egret on 16/1/26.
 */
var RpcMessageHandle = module.exports;

var RpcProto = require('../proto/RpcProto.js');
var Utils = require('../../libs/util/utils.js');
var Global = require('../../libs/global/global.js');
var GameMessage = require('./gameMessage.js');
var FrontMessage = require('./frontMessage.js');
var SessionService = require('../../libs/session/sessionService.js');
var Auth = require('../module/auth.js');
var World = require('../module/world.js');
var User = require('../module/user.js');
var Chat = require('../module/chat.js');

RpcMessageHandle.handles = {};

//***********系统使用消息 Start************//
RpcMessageHandle.handles[RpcProto.ID_rpc_helloServer_c2s] = function(session, data, callBack){
    Global.addServerClient(session, data);
};
RpcMessageHandle.handles[RpcProto.ID_rpc_gateDispatch_c2s] = function(session, data, callBack){
    GameMessage.receive(session, data);
};
RpcMessageHandle.handles[RpcProto.ID_rpc_sendToGate_c2s] = function(session, data, callBack) {
    var userSession = SessionService.getSession(data.userSessionId);
    userSession && FrontMessage.send(userSession, data.msgBody);
}
RpcMessageHandle.handles[RpcProto.ID_rpc_sendToGateByList_c2s] = function(session, data, callBack) {
    var sendBuf = Utils.packageBuffer(data.msgBody);
    var list = data.userSessionIdList;
    for (var i=0, len=list.length; i<len; i++) {
        var userSession = SessionService.getSession(list[i]);
        userSession && userSession.writeBufferToSocket(sendBuf);
    }
    sendBuf = null;
}
RpcMessageHandle.handles[RpcProto.ID_rpc_sendToGateByAll_c2s] = function(session, data, callBack) {
    var sendBuf = Utils.packageBuffer(data.msgBody);
    var sessions = SessionService.getAllSession();
    for (var sessionId in sessions){
        var userSession = sessions[sessionId];
        userSession && userSession.writeBufferToSocket(sendBuf);
    }
    sendBuf = null;
}
//***********系统使用消息 End************//


RpcMessageHandle.handles[RpcProto.ID_rpc_userJoinWorld_c2s] = function(session, data, callBack) {
    World.addUser(data, session, callBack);
}
RpcMessageHandle.handles[RpcProto.ID_rpc_userJoinGame_c2s] = function(session, data, callBack) {
    User.addUser(data.userSessionId, data.userId, data.userConnectorServer, callBack)
}
RpcMessageHandle.handles[RpcProto.ID_rpc_userJoinChat_c2s] = function(session, data, callBack) {
    Chat.addUser(data.userSessionId, data.userConnectorServer, data.userId, data.userName, data.unionId, callBack);
}
RpcMessageHandle.handles[RpcProto.ID_rpc_clientOffline_c2s] = function(session, data, callBack) {
    Auth.offline(data);
}
RpcMessageHandle.handles[RpcProto.ID_rpc_userExitWorld_c2s] = function(session, data, callBack) {
    World.removeUser(data);
}
RpcMessageHandle.handles[RpcProto.ID_rpc_userExitGame_c2s] = function(session, data, callBack) {
    User.removeUser(data.userSessionId);
}
RpcMessageHandle.handles[RpcProto.ID_rpc_userExitChat_c2s] = function(session, data, callBack) {
    Chat.removeUser(data.userSessionId);
}