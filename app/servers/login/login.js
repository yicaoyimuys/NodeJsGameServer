/**
 * Created by egret on 16/1/21.
 */

var Startup = require('../../startup.js');
var Server = require('../../../libs/server/server.js');
var Log = require('../../../libs/log/log.js');
var BackMessage = require('../../message/backMessage.js');

var loginServerConfig = Server.getByServer('login');
var gateServerConfig = Server.getByServer('gate');
var logServerConfig = Server.getByServer('log');


var gateReceiveMessage = new BackMessage();
var logReceiveMessage = new BackMessage();

Startup.init(loginServerConfig.id, 0);
Startup.connectBack(gateServerConfig, gateReceiveMessage);
Startup.connectBack(logServerConfig, logReceiveMessage);

