/**
 * Created by egret on 16/10/8.
 */
var UserSessionService = module.exports;

var session_count = 0;
var sessions = {};

UserSessionService.addSession = function(userSession) {
    sessions[userSession.id] = userSession;
    session_count++;

    userSession.addCloseCallBack(function(){
        UserSessionService.removeSession(userSession);
    });
};

UserSessionService.removeSession = function(userSession) {
    if (!sessions[userSession.id]) {
        return;
    }

    sessions[userSession.id] = null;
    delete sessions[userSession.id];
    session_count--;
}

UserSessionService.getSession = function(userSessionId) {
    return sessions[userSessionId];
}

UserSessionService.getSessionCount = function() {
    return session_count;
}

UserSessionService.getAllSession = function () {
    return sessions;
}