/**
 * Created by egret on 16/1/21.
 */

var Startup = require('../../startup.js');
var Server = require('../../../libs/server/server.js');
var Log = require('../../../libs/log/log.js');
var MsgID = require('../../message/msgId.js');
var BackMessage = require('../../message/backMessage.js');
var Global = require('../../../libs/global/global.js');

var serverName = 'logServer';
var serverConfig = Server.getByServer(serverName);

var logReceiveMessage = new BackMessage();
logReceiveMessage.addHandle(MsgID.System_HelloServer_C2S, function(session, data){
    Global.addServerClient(session, data);
});

Startup.init(serverName, 0);
Startup.listenerBack(serverConfig.port, logReceiveMessage);

