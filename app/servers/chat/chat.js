/**
 * Created by egret on 16/1/21.
 */

var Startup = require('../../startup.js');
var Server = require('../../../libs/config/server.js');
var Log = require('../../../libs/log/log.js');

var chatServerConfig = Server.getByServer('chat');
var gateServerConfig = Server.getByServer('gate');
var worldServerConfig = Server.getByServer('world');
var logServerConfig = Server.getByServer('log');

Startup.init(chatServerConfig.id);
Startup.listenerBack(chatServerConfig.port);
Startup.connectBack(gateServerConfig);
Startup.connectBack(worldServerConfig);
Startup.connectBack(logServerConfig);

