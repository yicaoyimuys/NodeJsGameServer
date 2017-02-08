/**
 * Created by egret on 16/1/21.
 */

var Startup = require('../../startup.js');
var Server = require('../../../libs/config/server.js');
var Log = require('../../../libs/log/log.js');

var serverConfig = Server.getByServer('gate');
Startup.init(serverConfig.id);

//是否使用WebSocket
if(serverConfig.clientIsWs){
    Startup.listenerFrontWs(serverConfig.clientPort);
} else {
    Startup.listenerFront(serverConfig.clientPort);
}

