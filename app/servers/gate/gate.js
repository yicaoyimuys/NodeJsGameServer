/**
 * Created by egret on 16/1/21.
 */

var Startup = require('../../startup.js');
var Server = require('../../../libs/server/server.js');
var Log = require('../../../libs/log/log.js');
var Proto = require('../../proto/proto.js');

var serverConfig = Server.getByServer('gate');

Startup.init(serverConfig.id, 0);
Startup.listenerFront(serverConfig.clientPort);
Startup.listenerBack(serverConfig.port);

