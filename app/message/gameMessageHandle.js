/**
 * Created by egret on 16/1/26.
 */
var GameMessageHandle = module.exports;

var Proto = require('../proto/gameProto.js');
var Utils = require('../../libs/util/utils.js');

var User = require('../module/user.js');

GameMessageHandle.handles = {};
GameMessageHandle.handles[Proto.ID_user_login_c2s] = function(data, cb, userSessionID){
    User.login(data.account, cb, userSessionID);
}
GameMessageHandle.handles[Proto.ID_user_joinGame_c2s] = function(data, cb, userSessionID){
    User.joinGame(data.userId, cb, userSessionID);
}