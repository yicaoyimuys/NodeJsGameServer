/**
 * Created by egret on 16/1/21.
 */
var SessionService = module.exports;
var Log = require('../log/log.js');

var MAX_SESSION_ID = 0;

var session_count = 0;
var sessions = {};

//创建一个Session
SessionService.addSession = function (session) {
    session.id = ++MAX_SESSION_ID;
    sessions[session.id] = session;
    session_count++;
    Log.debug("新增Session：" + session.id);
    Log.debug("Session总数量：" + session_count);
};

//移除一个Session
SessionService.removeSession = function (session) {
    if (sessions[session.id]) {
        sessions[session.id] = null;
        delete sessions[session.id];
        session_count--;
        Log.debug("删除Session：" + session.id);
        Log.debug("Session总数量：" + session_count);
    }
}

//获取Session总数量
SessionService.getSessionCount = function() {
    return session_count;
}