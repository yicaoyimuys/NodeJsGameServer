/**
 * Created by egret on 16/1/21.
 */

var Startup = require('../../startup.js');
var Server = require('../../../libs/config/server.js');
var Log = require('../../../libs/log/log.js');
var Proto = require('../../proto/proto.js');

var serverConfig = Server.getByServer('log');

Startup.init(serverConfig.id, 0);
Startup.listenerBack(serverConfig.port);

