/**
 * Created by egret on 16/1/21.
 */

var Startup = require('../../startup.js');
var Server = require('../../../libs/server/server.js');
var Log = require('../../../libs/log/log.js');
var Global = require('../../../libs/global/global.js');
var BackMessage = require('../../message/backMessage.js');
var Program = require('../../../libs/program/program.js');

var gameServerConfig = Server.getByServer('game')[Program.gameId.toString()];
var gateServerConfig = Server.getByServer('gate');
var chatServerConfig = Server.getByServer('chat');
var logServerConfig = Server.getByServer('log');

var gateReceiveMessage = new BackMessage();
var chatReceiveMessage = new BackMessage();
var logReceiveMessage = new BackMessage();

Startup.init(gameServerConfig.id);
Startup.connectBack(gateServerConfig, gateReceiveMessage);
Startup.connectBack(chatServerConfig, chatReceiveMessage);
Startup.connectBack(logServerConfig, logReceiveMessage);

