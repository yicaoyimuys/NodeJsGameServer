/**
 * Created by egret on 16/1/21.
 */
var Link = require('../libs/net/link.js');
var Global = require('../libs/global/global.js');
var Session = require('../libs/session/session.js');
var Log = require('../libs/log/log.js');
var EventEmitter = require('events').EventEmitter;

Global.serverName = 'testServer';
Log.init('testServer', 0);

var Event = new EventEmitter();
var SUM_CLIENT = 1000;

//连接
var successNum = 0;
var failNum = 0;
for(var i=0; i<SUM_CLIENT; i++){
    var clients = [];
    Link.connect('127.0.0.1', 8880, function(client){
        Log.debug('连接成功');
        client.addCloseCallBack(function(){
            Log.debug('连接关闭');
        });
        clients.push(client);

        client.send('yangsong');
        client.on(Session.DATA, function(data){
            Log.debug('收到消息:' + data.toString());
            successNum++
            if(successNum + failNum == SUM_CLIENT){
                Event.emit('success');
            }
        })

    }, function(){
        failNum++
        if(successNum + failNum == SUM_CLIENT){
            Event.emit('success');
        }
    })
}

//关闭
Event.on('success', function(){
    Log.debug('成功数：' + successNum)
    Log.debug('失败数：' + failNum)
    setTimeout(function(){
        for(var i=0;i<clients.length; i++){
            clients[i].close()
        }
    }, 3000);
})

process.on('uncaughtException', function(err) {
    Log.error('Caught exception: ' + err.stack);
});