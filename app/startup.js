/**
 * Created by egret on 16/1/21.
 */
var Startup = module.exports;
var Global = require('../libs/global/global.js');
var Log = require('../libs/log/log.js');
var Link = require('../libs/net/link.js');
var Timer = require('../libs/timer/timer.js');
var Session = require('../libs/session/session.js');
var SessionService = require('../libs/session/sessionService.js');
var MsgID = require('./message/msgId.js');
var BackMessage = require('./message/backMessage.js');

Startup.init = function(serverName) {
    Global.serverName = serverName;

    Log.init(serverName);

    process.on('uncaughtException', function(err) {
        Log.error('Caught exception: ' + err.stack);
    });

    Log.info('server starting ...');
};

Startup.listenerFront = function(port) {
    var acceptFunc = function(session) {
        Log.debug('front client connected：' + session.sock.remoteAddress + ':' + session.sock.remotePort);

        SessionService.addSession(session);
        session.addCloseCallBack(function(){
            SessionService.removeSession(session);
            Log.debug('front client disconnect on 127.0.0.1:' + port);
        });

        session.on(Session.DATA, function(buffer){
            Log.debug('收到消息：' + buffer.toString());
            session.send(buffer.toString());
        });
    };

    Link.serve(port, acceptFunc);
    Log.info('server listening front on 127.0.0.1:' + port);
}

Startup.listenerBack = function(port, messageHandle) {
    var acceptFunc = function(session) {
        //Log.debug('back client connected：' + session.sock.remoteAddress + ':' + session.sock.remotePort);
        session.on(Session.DATA, function(data){
            messageHandle.receive(session, data);
        });
    };

    Link.serve(port, acceptFunc);
    Log.info('server listening back on 127.0.0.1:' + port);
}

Startup.connectBack = function(serverConfig, messageHandle) {
    var serverName = serverConfig.id;
    var host = serverConfig.host;
    var port = serverConfig.port;

    var againConnect = function(){
        Log.error('after 30 second，back client again connect ' + serverName + ', '+ host + ':' + port);
        //30秒一次
        Timer.setTimeout(30*1000, function(){
            Startup.connectBack(serverConfig, messageHandle);
        });
    }

    Link.connect(host, port, function(session){
        //Log.info('back client connect on ' + host + ':' + port);

        Global[serverName] = session;
        session.addCloseCallBack(function(){
            Global[serverName] = null;
            againConnect();
        });

        //发送HelloServer
        BackMessage.send(session, MsgID.System_HelloServer_C2S, {"serverName":Global.serverName});

        //监听收到的消息
        session.on(Session.DATA, function(data){
            messageHandle.receive(data);
        });
    }, function(){
        againConnect();
    });
}