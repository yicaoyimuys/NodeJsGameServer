/**
 * Created by egret on 16/1/21.
 */

var Startup = require('../../startup.js');
var Server = require('../../../libs/server/server.js');
var Log = require('../../../libs/log/log.js');
var MsgID = require('../../message/msgId.js');
var BackMessage = require('../../message/backMessage.js');
var Global = require('../../../libs/global/global.js');

var serverConfig = Server.getByServer('gate');

var gateReceiveMessage = new BackMessage();
gateReceiveMessage.addHandle(MsgID.System_HelloServer_C2S, function(session, data){
    Global.addServerClient(session, data);
});

Startup.init(serverConfig.id, 0);
Startup.listenerFront(serverConfig.clientPort);
Startup.listenerBack(serverConfig.port, gateReceiveMessage);

