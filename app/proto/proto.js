/**
 * Created by yangsong on 16/1/24.
 */
var Log = require('../../libs/log/log.js');

var Proto = module.exports;

Proto.system_helloServer = require('./msg/system_helloServer.js');
Proto.user_login_c2s = require('./msg/user_login_c2s.js');
Proto.user_login_s2c = require('./msg/user_login_s2c.js');
Proto.userInfo = require('./msg/userInfo.js');


Proto.ID_system_helloServer = 10001;
Proto.ID_user_login_c2s = 1000;
Proto.ID_user_login_s2c = 1001;


var dic = {
	"10001":"system_helloServer",
	"1000":"user_login_c2s",
	"1001":"user_login_s2c"
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