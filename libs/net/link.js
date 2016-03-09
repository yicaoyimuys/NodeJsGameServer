/**
 * Created by egret on 16/1/21.
 */
var Link = module.exports;

var Net = require('net');
var Utils = require('../util/utils.js');
var Session = require('../session/session.js');
var Log = require('../log/log.js');
var Http = require('http');

Link.serveByWebSocket = function(port, acceptFunc) {
    var httpServer = Http.createServer(function(req, res) {
        res.writeHead(200, {'Content-type': 'text/html'});
    });

    httpServer.listen(port);
    var io = require('socket.io')(httpServer);
    io.sockets.on('connection', function (sock) {
        var session = new Session(sock);
        Utils.invokeCallback(acceptFunc, session);
    });
    io.sockets.on('error', function(err){
        Log.error('listen error：' + err);
    });
}

Link.connectByWebSocket = function(host, port, successFunc, failFunc) {
    var client = require('socket.io-client')('ws://'+host+':'+port);
    client.on('error', function(err){
        Log.error('connect error：' + err);
        Utils.invokeCallback(failFunc);
    });
    client.on('connect', function() {
        var session = new Session(client);
        Utils.invokeCallback(successFunc, session);
    });
};

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