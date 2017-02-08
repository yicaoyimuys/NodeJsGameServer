/**
 * Created by egret on 16/1/21.
 */

var Startup = require('../../startup.js');
var Server = require('../../../libs/config/server.js');
var Log = require('../../../libs/log/log.js');
var Program = require('../../../libs/program/program.js');
var Scene = require('../../module/scene.js')

var gameServerConfig = Server.getByServer('game')[Program.gameId.toString()];
var connectorServerConfig = Server.getByServer('connector');
var worldServerConfig = Server.getByServer('world');
var logServerConfig = Server.getByServer('log');

Startup.init(gameServerConfig.id);
Startup.initRedis();
for(var key in connectorServerConfig){
    Startup.connectBack(connectorServerConfig[key]);
}
Startup.connectBack(worldServerConfig);
Startup.connectBack(logServerConfig);

//场景初始化
Scene.init();

