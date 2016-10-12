/**
 * Created by egret on 16/10/10.
 */
var Startup = require('../../startup.js');
var Server = require('../../../libs/config/server.js');
var Log = require('../../../libs/log/log.js');

var worldServerConfig = Server.getByServer('world');
var logServerConfig = Server.getByServer('log');

Startup.init(worldServerConfig.id);
Startup.initRedis();
Startup.listenerBack(worldServerConfig.port);
Startup.connectBack(logServerConfig);