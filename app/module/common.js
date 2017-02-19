/**
 * Created by yangsong on 17/2/19.
 */
var GameProto = require('../proto/gameProto.js');
var Rpc = require('../message/rpc.js');

var Common = module.exports;

Common.sendErrorCode = function(userSession, errorCode) {
    var errorMsg = new GameProto.error_notice_s2c();
    errorMsg.errorCode = errorCode;
    Rpc.notifyClient(userSession, errorMsg);
}