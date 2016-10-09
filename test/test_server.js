/**
 * Created by egret on 16/1/21.
 */
var Link = require('../libs/net/link.js');
var Global = require('../libs/global/global.js');
var Session = require('../libs/session/session.js');
var Log = require('../libs/log/log.js');
var Proto = require('../app/proto/gameProto.js');
var EventEmitter = require('events').EventEmitter;

Global.serverName = 'testServer';
Log.init('testServer', 0);

var Event = new EventEmitter();
var SUM_CLIENT = 10;

//连接
var clients = [];
var successNum = 0;
var failNum = 0;
var now = Date.now();

var arr = [];
for(var i=0; i<SUM_CLIENT; i++){
    while(true){
        var flag = Math.ceil(Math.random() * 10000);
        if(arr.indexOf(flag) == -1){
            arr.push(flag);
            break;
        }
    }
}
for(var i=0; i<SUM_CLIENT; i++){
    connect(i);
}

function connect(index){
    Link.connectByWebSocket('127.0.0.1', 8880, function(client){
    //Link.connect('127.0.0.1', 8880, function(client){
        Log.debug('连接成功');
        client.addCloseCallBack(function(){
            Log.debug('连接关闭');
        });
        clients.push(client);

        //登录认证
        var sendMsg = new Proto.user_login_c2s();
        sendMsg.account = 'yangsong' + arr[index];
        client.send(sendMsg.encode());
        //console.log(sendMsg.encode());

        var myUserName = '';
        client.on(Session.DATA, function(data){
            //console.log(data);

            var msg = Proto.decode(data);
            if(msg.msgId == Proto.ID_user_login_s2c){
                myUserName = msg.user.userName;
                //console.log(myUserName, '收到用户消息:', msg);

                //进入游戏
                sendMsg = new Proto.user_joinGame_c2s();
                sendMsg.userId = msg.user.userId;
                client.send(sendMsg.encode());
            }
            else if(msg.msgId == Proto.ID_user_joinGame_s2c){
                //console.log(myUserName, '收到用户消息:', msg);
                //发送聊天
                sendMsg = new Proto.user_chat_c2s();
                sendMsg.chatMsg = 'Hello ' + myUserName;
                sendMsg.channel = 2;
                client.send(sendMsg.encode());
            } else if(msg.msgId == Proto.ID_user_chat_s2c){
                console.log(myUserName, '收到用户消息:', msg);
                //successNum++
                //if(successNum + failNum == SUM_CLIENT){
                //    Event.emit('success');
                //}
            } else {
                console.log(myUserName, '收到用户消息:', msg);
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
    console.log('成功数：' + successNum)
    console.log('失败数：' + failNum)
    console.log('耗时：'+ (Date.now()-now));
    setTimeout(function(){
        for(var i=0;i<clients.length; i++){
            clients[i].close()
        }
    }, 3000);
})

process.on('uncaughtException', function(err) {
    Log.error('Caught exception: ' + err.stack);
});