/**
 * Created by yangsong on 16/1/24.
 */
var Global = require('../../libs/global/global.js');
var SessionService = require('../../libs/session/sessionService.js');
var Log = require('../../libs/log/log.js');
var Proto = require('../proto/proto.js');
var BackMessage = require('./backMessage.js');
var FrontMessage = require('./frontMessage.js');

var BackMessageHandle = module.exports;

BackMessageHandle.handles = {};
BackMessageHandle.handles[Proto.ID_system_helloServer] = Global.addServerClient;
BackMessageHandle.handles[Proto.ID_system_gateDispatch] = function(session, data) {
    var msg = new Proto.system_sendToGate();
    msg.userSessionID = data.userSessionID;
    msg.msgBody = data.msgBody;
    BackMessage.send('gate', msg);
}
BackMessageHandle.handles[Proto.ID_system_sendToGate] = function(session, data) {
    var userSession = SessionService.getSession(data.userSessionID);
    FrontMessage.send(userSession, data.msgBody);
}