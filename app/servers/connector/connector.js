/**
 * Created by egret on 16/1/21.
 */

var Startup = require('../../startup.js');
var Server = require('../../../libs/config/server.js');
var Log = require('../../../libs/log/log.js');
var Program = require('../../../libs/program/program.js');
//var Heapdump = require('heapdump');

var connectorServerConfig = Server.getByServer('connector')[Program.connectorId.toString()];

Startup.init(connectorServerConfig.id);
//是否使用WebSocket
if(connectorServerConfig.clientIsWs){
    Startup.listenerFrontWs(connectorServerConfig.clientPort);
} else {
    Startup.listenerFront(connectorServerConfig.clientPort);
}
Startup.listenerBack(connectorServerConfig.port);

