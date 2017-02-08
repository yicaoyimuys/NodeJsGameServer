/**
 * Created by egret on 16/1/21.
 */
var Link = module.exports;

var Net = require('net');
var Utils = require('../util/utils.js');
var Session = require('../session/session.js');
var Log = require('../log/log.js');
var Request = require('request');

Link.serveByWebSocket = function(port, acceptFunc) {
    var WebSocketServer = require('ws').Server;
    var wss = new WebSocketServer({
        //perMessageDeflate: false,
        port: port
    });

    wss.on('connection', function(sock) {
        var session = new Session(sock);
        Utils.invokeCallback(acceptFunc, session);
    });
    wss.on('error', function(err){
        Log.error('listen error：' + err);
    });
}

Link.connectByWebSocket = function(host, port, successFunc, failFunc) {
    var WebSocket = require('ws');
    var client = new WebSocket('ws://'+host+':'+port);

    client.on('open', function() {
        var session = new Session(client);
        Utils.invokeCallback(successFunc, session);
    });
    client.on('error', function(err){
        Log.error('connect error：' + err);
        Utils.invokeCallback(failFunc);
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

Link.requestPost = function(url, param, successFunc, failFunc){
    Request.post({url:url, form: param}, function (error, response, body) {
        if(error){
            failFunc(error, -1, url);
        }
        else{
            if (response.statusCode == 200) {
                successFunc(body);
            }
            else{
                failFunc(null, response.statusCode, url);
            }
        }
    })
}

Link.request = function(url, successFunc, failFunc){
    Request(url, function (error, response, body) {
        if(error){
            failFunc(error, -1, url);
        }
        else{
            if (response.statusCode == 200) {
                successFunc(body);
            }
            else{
                failFunc(null, response.statusCode, url);
            }
        }
    })
}