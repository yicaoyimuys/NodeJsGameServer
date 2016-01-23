/**
 * Created by egret on 16/1/21.
 */

var Startup = require('../../startup.js');
var Server = require('../../../libs/server/server.js');
var Log = require('../../../libs/log/log.js');
var MsgID = require('../../message/msgId.js');
var BackMessage = require('../../message/backMessage.js');
var Global = require('../../../libs/global/global.js');

var chatServerConfig = Server.getByServer('chat');
var gateServerConfig = Server.getByServer('gate');

var chatReceiveMessage = new BackMessage();
chatReceiveMessage.addHandle(MsgID.System_HelloServer_C2S, function(session, data){
    Global.addServerClient(session, data);
});

var gateReceiveMessage = new BackMessage();

Startup.init(chatServerConfig.id, 0);
Startup.listenerBack(chatServerConfig.port, chatReceiveMessage);
Startup.connectBack(gateServerConfig, gateReceiveMessage);

