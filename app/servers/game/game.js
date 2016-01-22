/**
 * Created by egret on 16/1/21.
 */

var Startup = require('../../startup.js');
var Server = require('../../../libs/server/server.js');
var Log = require('../../../libs/log/log.js');
var Global = require('../../../libs/global/global.js');
var BackMessage = require('../../message/backMessage.js');
var Program = require('commander');

Program
    .option('-s, --serverID <n>', 'An integer argument', parseInt)
    .parse(process.argv);

var serverName = 'gameServer';
var gateServerConfig = Server.getByServer('gateServer');
var chatServerConfig = Server.getByServer('chatServer');
var logServerConfig = Server.getByServer('logServer');

var gateReceiveMessage = new BackMessage();
var chatReceiveMessage = new BackMessage();
var logReceiveMessage = new BackMessage();

Startup.init(serverName, Program.serverID);
Startup.connectBack('gateServer', gateServerConfig.host, gateServerConfig.port, gateReceiveMessage);
Startup.connectBack('chatServer', chatServerConfig.host, chatServerConfig.port, chatReceiveMessage);
Startup.connectBack('logServer', logServerConfig.host, logServerConfig.port, logReceiveMessage);

