/**
 * Created by yangsong on 16/1/24.
 */
var Global = require('../../libs/global/global.js');
var SessionService = require('../../libs/session/sessionService.js');
var DataService = require('../data/dataService.js');
var Log = require('../../libs/log/log.js');
var Proto = require('../proto/systemProto.js');
var BackMessage = require('./backMessage.js');
var FrontMessage = require('./frontMessage.js');
var GameMessage = require('./gameMessage.js');

var BackMessageHandle = module.exports;

BackMessageHandle.handles = {};
BackMessageHandle.handles[Proto.ID_system_helloServer] = Global.addServerClient;
BackMessageHandle.handles[Proto.ID_system_gateDispatch] = function(session, data) {
    GameMessage.receive(data, function(sendMsgBody){
        var msg = new Proto.system_sendToGate();
        msg.userSessionID = data.userSessionID;
        msg.msgBody = sendMsgBody;
        BackMessage.send('gate', msg);
    })
}
BackMessageHandle.handles[Proto.ID_system_sendToGate] = function(session, data) {
    var userSession = SessionService.getSession(data.userSessionID);
    FrontMessage.send(userSession, data.msgBody);
}
BackMessageHandle.handles[Proto.ID_system_clientOffline] = function(session, data) {
    var user = DataService.getUserBySession(data.userSessionID);
    if(user){
        user.session.close();
    }
}