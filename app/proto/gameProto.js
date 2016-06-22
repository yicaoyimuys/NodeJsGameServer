/**
 * Created by yangsong on 16/1/24.
 */
var Log = require('../../libs/log/log.js');

var Proto = module.exports;

Proto.user_login_c2s = require('./msg/user_login_c2s.js');
Proto.user_login_s2c = require('./msg/user_login_s2c.js');
Proto.userInfo = require('./msg/userInfo.js');
Proto.user_joinGame_c2s = require('./msg/user_joinGame_c2s.js');
Proto.user_joinGame_s2c = require('./msg/user_joinGame_s2c.js');


Proto.ID_user_login_c2s = 1001;
Proto.ID_user_login_s2c = 1002;
Proto.ID_user_joinGame_c2s = 2001;
Proto.ID_user_joinGame_s2c = 2002;


var dic = {
	"1001":"user_login_c2s",
	"1002":"user_login_s2c",
	"2001":"user_joinGame_c2s",
	"2002":"user_joinGame_s2c"
}

Proto.decode = function(buff){
	var msgId = buff.readUInt16BE(0)
	if(!dic[msgId]){
		Log.error('收到未知消息ID：' + msgId);
		return;
	}
	var data = new Proto[dic[msgId]]();
	data.decode(buff);
	return data;
}