/**
 * Created by egret on 16/1/21.
 */

var Startup = require('../../startup.js');
var Server = require('../../../libs/config/server.js');
var Log = require('../../../libs/log/log.js');
var Program = require('../../../libs/program/program.js');

var gameServerConfig = Server.getByServer('game')[Program.gameId.toString()];
var gateServerConfig = Server.getByServer('gate');
var worldServerConfig = Server.getByServer('world');
var logServerConfig = Server.getByServer('log');

Startup.init(gameServerConfig.id);
Startup.initRedis();
Startup.connectBack(gateServerConfig);
Startup.connectBack(worldServerConfig);
Startup.connectBack(logServerConfig);

