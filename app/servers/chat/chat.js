/**
 * Created by egret on 16/1/21.
 */

var Startup = require('../../startup.js');
var Server = require('../../../libs/config/server.js');
var Log = require('../../../libs/log/log.js');

var chatServerConfig = Server.getByServer('chat');
var connectorServerConfig = Server.getByServer('connector');
var worldServerConfig = Server.getByServer('world');
var logServerConfig = Server.getByServer('log');

Startup.init(chatServerConfig.id);
Startup.listenerBack(chatServerConfig.port);
for(var key in connectorServerConfig){
    Startup.connectBack(connectorServerConfig[key]);
}
Startup.connectBack(worldServerConfig);
Startup.connectBack(logServerConfig);

