/**
 * Created by egret on 16/1/21.
 */

var Startup = require('../../startup.js');
var Server = require('../../../libs/server/server.js');
var Log = require('../../../libs/log/log.js');
var BackMessage = require('../../message/backMessage.js');

var serverName = 'loginServer';
var gateServerConfig = Server.getByServer('gateServer');
var logServerConfig = Server.getByServer('logServer');


var gateReceiveMessage = new BackMessage();
var logReceiveMessage = new BackMessage();

Startup.init(serverName, 0);
Startup.connectBack('gateServer', gateServerConfig.host, gateServerConfig.port, gateReceiveMessage);
Startup.connectBack('logServer', logServerConfig.host, logServerConfig.port, logReceiveMessage);

