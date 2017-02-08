/**
 * Created by egret on 16/2/16.
 */
exports.isGateMsg = function(msgId){
    return msgId >= 500 && msgId <= 999;
}

exports.isLoginMsg = function(msgId){
    return msgId >= 1000 && msgId <= 1499;
}

exports.isChatMsg = function(msgId){
    return msgId >= 1500 && msgId <= 1999;
}

exports.isGameMsg = function(msgId){
    return msgId >= 2000 && msgId <= 5999;
}