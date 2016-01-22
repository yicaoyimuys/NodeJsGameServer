/**
 * Created by egret on 16/1/21.
 */
var Link = module.exports;

var Net = require('net');
var Utils = require('../util/utils.js');
var Session = require('../session/session.js');
var Log = require('../log/log.js');

Link.serve = function(port, acceptFunc) {
    var tcpServer = Net.createServer(function(sock){
        var session = new Session(sock);
        Utils.invokeCallback(acceptFunc, session);
    });
    tcpServer.on('error', function(err){
        Log.error('listen error：' + err);
    });
    tcpServer.listen(port);
};

Link.connect = function(host, port, successFunc, failFunc) {
    var client = new Net.Socket();
    client.on('error', function(err){
        Log.error('connect error：' + err);
        Utils.invokeCallback(failFunc);
    });
    client.connect({'host':host, 'port':port}, function(){
        var session = new Session(client);
        Utils.invokeCallback(successFunc, session);
    });
};