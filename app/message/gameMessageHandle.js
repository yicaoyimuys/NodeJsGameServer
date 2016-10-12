/**
 * Created by egret on 16/1/26.
 */
var GameMessageHandle = module.exports;

var Proto = require('../proto/gameProto.js');
var Utils = require('../../libs/util/utils.js');

var Auth = require('../module/auth.js');
var User = require('../module/user.js');
var Chat = require('../module/chat.js');

GameMessageHandle.handles = {};
GameMessageHandle.handles[Proto.ID_user_login_c2s] = function(userSession, data){
    Auth.login(userSession, data.account);
}
GameMessageHandle.handles[Proto.ID_user_joinGame_c2s] = function(userSession, data){
    User.joinGame(userSession);
}

GameMessageHandle.handles[Proto.ID_user_chat_c2s] = function(userSession, data){
    Chat.talk(userSession, data.chatMsg, data.channel);
}