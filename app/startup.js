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
var BackMessage = require('./message/backMessage.js');
var FrontMessage = require('./message/frontMessage.js');
var Proto = require('./proto/systemProto.js');
var Db = require('../libs/config/db.js');
var Redis = require('../libs/config/redis.js');
var SqlClient = require('./dao/mysql/client.js');
var RedisClient = require('./cache/redis/redis.js');

Startup.init = function(serverName) {
    Global.serverName = serverName;

    Log.init(serverName);

    process.on('uncaughtException', function(err) {
        Log.error('Caught exception: ' + err.stack);
    });

    Log.info('server starting ...');
};

Startup.initUseDb = function() {
    Global.userDb = new SqlClient(Db.get('user'));
}

Startup.initRedis = function() {
    Global.redis = new RedisClient(Redis.get());
}


var frontSocketAcceptFunc = function(session) {
    Log.debug('front client connected');

    SessionService.addSession(session);
    session.addCloseCallBack(function(){
        var sendMsg = new Proto.system_clientOffline();
        sendMsg.userSessionID = session.id;
        //通知后端服务器用户下线
        {
            //登录服务器
            BackMessage.send('login', sendMsg);
            //游戏服务器
            BackMessage.send(Global[session.gameServer], sendMsg);
            //Chat服务器
            BackMessage.send('chat', sendMsg);
        }
        Log.debug('front client disconnect');
    });

    session.on(Session.DATA, function(data){
        FrontMessage.receive(session, data);
    });
};

Startup.listenerFrontWs = function(port) {
    Link.serveByWebSocket(port, frontSocketAcceptFunc);
    Log.info('server listening front on 127.0.0.1:' + port);
}

Startup.listenerFront = function(port) {
    Link.serve(port, frontSocketAcceptFunc);
    Log.info('server listening front on 127.0.0.1:' + port);
}

Startup.listenerBack = function(port) {
    var acceptFunc = function(session) {
        //Log.debug('back client connected：' + session.sock.remoteAddress + ':' + session.sock.remotePort);
        session.on(Session.DATA, function(data){
            BackMessage.receive(session, data);
        });
    };

    Link.serve(port, acceptFunc);
    Log.info('server listening back on 127.0.0.1:' + port);
}

Startup.connectBack = function(serverConfig) {
    var serverName = serverConfig.id;
    var host = serverConfig.host;
    var port = serverConfig.port;

    var againConnect = function(){
        Log.error('after 30 second，back client again connect ' + serverName + ', '+ host + ':' + port);
        //30秒一次
        Timer.setTimeout(30*1000, function(){
            Startup.connectBack(serverConfig);
        });
    }

    Link.connect(host, port, function(session){
        Log.info('back client connect success ' + serverName + ', '+ host + ':' + port);
        Global.bindServer(session, serverName);

        session.addCloseCallBack(function(isActive){
            Log.error('back client session close');
            if(!isActive){
                againConnect();
            }
        });

        //发送HelloServer
        var sendMsg = new Proto.system_helloServer();
        sendMsg.serverName = Global.serverName;
        BackMessage.send(session, sendMsg);

        //监听收到的消息
        session.on(Session.DATA, function(data){
            BackMessage.receive(session, data);
        });
    }, function(){
        againConnect();
    });
}