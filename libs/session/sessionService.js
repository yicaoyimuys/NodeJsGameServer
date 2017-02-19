/**
 * Created by egret on 16/1/21.
 */
var Log = require('../log/log.js');
var Global = require('../global/global.js');
var Timer = require('../timer/timer.js');
var MyDate = require('../date/date.js');

var SessionService = module.exports;

var session_count = 0;
var sessions = {};

//创建一个Session
SessionService.addSession = function (session) {
    session.id = Global.guid.newId();
    sessions[session.id] = session;
    session_count++;
    Log.debug("新增Session：" + session.id + "，Session总数量：" + session_count);

    session.addCloseCallBack(function(){
        SessionService.removeSession(session);
    });
};

//移除一个Session
SessionService.removeSession = function (session) {
    if (!sessions[session.id]) {
        return;
    }

    sessions[session.id] = null;
    delete sessions[session.id];
    session_count--;
    Log.debug("删除Session：" + session.id + "，Session总数量：" + session_count);
}

//获取Session
SessionService.getSession = function(sessionID) {
    return sessions[sessionID];
}

//获取Session总数量
SessionService.getSessionCount = function() {
    return session_count;
}

//获得所有session
SessionService.getAllSession = function () {
    return sessions;
}

SessionService.openCheckPing = function() {
    //2秒钟检测一次
    Timer.setInterval(2000, function(){
        var now = MyDate.unix();
        var sessionKeys = Object.keys(sessions);
        for(var i=0,len=sessionKeys.length; i<len; i++){
            var sessionId = sessionKeys[i];
            var session = sessions[sessionId];
            if(!session){
                continue;
            }
            //超过10秒关闭Session
            if(now - session.pingTime > 10){
                session.close();
            }
        }
    })
}