/**
 * Created by egret on 16/1/21.
 */

var Startup = require('../../startup.js');
var Server = require('../../../libs/server/server.js');
var Log = require('../../../libs/log/log.js');
var MsgID = require('../../message/msgId.js');
var BackMessage = require('../../message/backMessage.js');
var Global = require('../../../libs/global/global.js');

var serverName = 'chatServer';
var chatServerConfig = Server.getByServer(serverName);
var gateServerConfig = Server.getByServer('gateServer');

var chatReceiveMessage = new BackMessage();
chatReceiveMessage.addHandle(MsgID.System_HelloServer_C2S, function(session, data){
    Global.addServerClient(session, data);
});

var gateReceiveMessage = new BackMessage();

Startup.init(serverName, 0);
Startup.listenerBack(chatServerConfig.port, chatReceiveMessage);
Startup.connectBack('gateServer', gateServerConfig.host, gateServerConfig.port, gateReceiveMessage);

