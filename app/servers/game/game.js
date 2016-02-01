/**
 * Created by egret on 16/1/21.
 */

var Startup = require('../../startup.js');
var Server = require('../../../libs/config/server.js');
var Log = require('../../../libs/log/log.js');
var Program = require('../../../libs/program/program.js');

var gameServerConfig = Server.getByServer('game')[Program.gameId.toString()];
var gateServerConfig = Server.getByServer('gate');
var chatServerConfig = Server.getByServer('chat');
var logServerConfig = Server.getByServer('log');

Startup.init(gameServerConfig.id);
Startup.initRedis();
Startup.initAsyncUserDb();
Startup.connectBack(gateServerConfig);
Startup.connectBack(chatServerConfig);
Startup.connectBack(logServerConfig);

