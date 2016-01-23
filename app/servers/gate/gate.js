/**
 * Created by egret on 16/1/21.
 */

var Startup = require('../../startup.js');
var Server = require('../../../libs/server/server.js');
var Log = require('../../../libs/log/log.js');
var Proto = require('../../proto/proto.js');
var BackMessage = require('../../message/backMessage.js');
var Global = require('../../../libs/global/global.js');

var serverConfig = Server.getByServer('gate');

var gateReceiveMessage = new BackMessage();
gateReceiveMessage.addHandle(Proto.ID_system_helloServer, function(session, data){
    Global.addServerClient(session, data);
});

Startup.init(serverConfig.id, 0);
Startup.listenerFront(serverConfig.clientPort);
Startup.listenerBack(serverConfig.port, gateReceiveMessage);

