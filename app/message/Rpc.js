/**
 * Created by yangsong on 17/2/19.
 */
var Utils = require('../../libs/util/utils.js');
var Log = require('../../libs/log/log.js');
var MyDate = require('../../libs/date/date.js');
var Server = require('../../libs/config/server.js');
var Global = require('../../libs/global/global.js');
var Timer = require('../../libs/timer/timer.js');
var Session = require('../../libs/session/session.js');
var SystemProto = require('../proto/systemProto.js');
var RpcProto = require('../proto/rpcProto.js');
var RpcMessage = require('./rpcMessage.js');

var Rpc = module.exports;

var RpcID = 0;
var CallBackList = {};

//处理过期的rpc，5秒钟执行一次
Timer.setInterval(5000, function(){
    var now = MyDate.unix();
    var keys = Object.keys(CallBackList);
    for(var i=0,len=keys.length; i<len; i++){
        var key = keys[i];
        var callBack = CallBackList[key];
        //大于20秒
        if(now - callBack[1] > 20){
            CallBackList[key] = null;
            delete CallBackList[key];
            Log.error('rpc执行时间过长，或者无返回');
        }
    }
});

var getServerSession = function(server){
    if(!server){
        return null;
    }

    var session = null;
    if(server instanceof Session){
        session = server;
    } else {
        session = Global[server];
        if(!session){
            session = Global[Server.getByServer(server).id];
        }
    }

    return session;
}

var addRpcId = function(){
    if(RpcID == Math.pow(2, 32) - 1){
        RpcID = 0;
    }
    RpcID++;
}

Rpc.call = function(server, msg, callback) {
    var session = getServerSession(server);
    if(!session){
        Log.error('Rpc.call session is not exists: ' + server);
        return null;
    }

    addRpcId();

    var sendMsg = new SystemProto.system_rpcCall_c2s();
    sendMsg.rpcId = RpcID;
    sendMsg.msgBody = msg.encode();
    session.send(sendMsg.encode());

    CallBackList[RpcID] = [callback, MyDate.unix()];
}

Rpc.notify = function(server, msg) {
    var session = getServerSession(server);
    if(!session){
        Log.error('Rpc.notify session is not exists: ' + server);
        return null;
    }

    var sendMsg = new SystemProto.system_rpcNotify_c2s();
    sendMsg.msgBody = msg.encode();
    session.send(sendMsg.encode());
}

var callBack = function(rpcId, msg){
    var callBack = CallBackList[rpcId];
    if(!callBack){
        Log.error("Rpc.callBack is not exists：" + rpcId)
        return;
    }

    var obj = RpcProto.decode(msg);
    callBack[0](obj);

    CallBackList[rpcId] = null;
    delete CallBackList[rpcId];
}

var sendCallBack = function(server, rpcId, msg){
    var session = getServerSession(server);
    if(!session){
        Log.error('Rpc.sendCallBack session is not exists: ' + server);
        return null;
    }

    var sendMsg = new SystemProto.system_rpcCall_s2c();
    sendMsg.rpcId = rpcId;
    sendMsg.msgBody = msg.encode();
    session.send(sendMsg.encode());
}

Rpc.receive = function(session, receiveBuff) {
    var receiveMsg = SystemProto.decode(receiveBuff);
    Log.debug('Rpc.receive收到消息ID：' + receiveMsg.msgId);

    switch(receiveMsg.msgId){
        case SystemProto.ID_system_rpcCall_c2s:
            RpcMessage.receive(session, receiveMsg.msgBody, function(callBackMsg){
                sendCallBack(session, receiveMsg.rpcId, callBackMsg);
            });
            break;
        case SystemProto.ID_system_rpcCall_s2c:
            callBack(receiveMsg.rpcId, receiveMsg.msgBody);
            break;
        case SystemProto.ID_system_rpcNotify_c2s:
            RpcMessage.receive(session, receiveMsg.msgBody);
            break;
        default :
            Log.error('Rpc.receive收到未处理的消息ID: ' + receiveMsg.msgId);
            break;
    }
}


Rpc.notifyClient = function(userSession, sendMsg) {
    var msg = new RpcProto.rpc_sendToGate_c2s();
    msg.userSessionId = userSession.id;
    msg.msgBody = sendMsg.encode();
    Rpc.notify(userSession.session, msg);
}

Rpc.notifyClientByAll = function(sendMsg) {
    var msg = new RpcProto.rpc_sendToGateByAll_c2s();
    msg.msgBody = sendMsg.encode();

    var connectorServerConfig = Server.getByServer('connector');
    for(var key in connectorServerConfig){
        Rpc.notify(Global[connectorServerConfig[key].id], msg);
    }
}

Rpc.notifyClientByList = function(sessionList, sendMsg) {
    var msg = new RpcProto.rpc_sendToGateByList_c2s();
    msg.userSessionIdList = sessionList;
    msg.msgBody = sendMsg.encode();

    var connectorServerConfig = Server.getByServer('connector');
    for(var key in connectorServerConfig){
        Rpc.notify(Global[connectorServerConfig[key].id], msg);
    }
}