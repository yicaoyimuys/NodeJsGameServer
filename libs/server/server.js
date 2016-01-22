/**
 * Created by egret on 16/1/21.
 */
var Server = module.exports;
var ServerConfig = require('../../config/server.json');

Server.getByServer = function(serverName) {
    return ServerConfig[serverName];
}