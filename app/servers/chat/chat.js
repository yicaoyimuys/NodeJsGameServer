/**
 * Created by egret on 16/1/21.
 */

var Startup = require('../../startup.js');
var Server = require('../../../libs/config/server.js');
var Log = require('../../../libs/log/log.js');

var chatServerConfig = Server.getByServer('chat');
var gateServerConfig = Server.getByServer('gate');

Startup.init(chatServerConfig.id, 0);
Startup.listenerBack(chatServerConfig.port);
Startup.connectBack(gateServerConfig);

