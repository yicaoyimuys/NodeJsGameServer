/**
 * Created by yangsong on 16/1/24.
 */
var Log = require('../../libs/log/log.js');

var Proto = module.exports;

Proto.get_connector_c2s = require('./msg/get_connector_c2s.js');
Proto.get_connector_s2c = require('./msg/get_connector_s2c.js');
Proto.client_ping_c2s = require('./msg/client_ping_c2s.js');
Proto.user_login_c2s = require('./msg/user_login_c2s.js');
Proto.user_login_s2c = require('./msg/user_login_s2c.js');
Proto.userInfo = require('./msg/userInfo.js');
Proto.error_notice_s2c = require('./msg/error_notice_s2c.js');
Proto.user_joinScene_c2s = require('./msg/user_joinScene_c2s.js');
Proto.user_joinScene_s2c = require('./msg/user_joinScene_s2c.js');
Proto.obj_join_s2c = require('./msg/obj_join_s2c.js');
Proto.obj_leave_s2c = require('./msg/obj_leave_s2c.js');
Proto.att_info = require('./msg/att_info.js');
Proto.obj_info = require('./msg/obj_info.js');
Proto.obj_walk_info = require('./msg/obj_walk_info.js');
Proto.player_walk_c2s = require('./msg/player_walk_c2s.js');
Proto.obj_walk_s2c = require('./msg/obj_walk_s2c.js');
Proto.obj_walk_stop_s2c = require('./msg/obj_walk_stop_s2c.js');
Proto.user_chat_c2s = require('./msg/user_chat_c2s.js');
Proto.user_chat_s2c = require('./msg/user_chat_s2c.js');


Proto.ID_get_connector_c2s = 501;
Proto.ID_get_connector_s2c = 502;
Proto.ID_client_ping_c2s = 1000;
Proto.ID_user_login_c2s = 1001;
Proto.ID_user_login_s2c = 1002;
Proto.ID_error_notice_s2c = 2000;
Proto.ID_user_joinScene_c2s = 2001;
Proto.ID_user_joinScene_s2c = 2002;
Proto.ID_obj_join_s2c = 2003;
Proto.ID_obj_leave_s2c = 2004;
Proto.ID_player_walk_c2s = 2005;
Proto.ID_obj_walk_s2c = 2006;
Proto.ID_obj_walk_stop_s2c = 2007;
Proto.ID_user_chat_c2s = 1500;
Proto.ID_user_chat_s2c = 1501;


var dic = {
	"501":"get_connector_c2s",
	"502":"get_connector_s2c",
	"1000":"client_ping_c2s",
	"1001":"user_login_c2s",
	"1002":"user_login_s2c",
	"2000":"error_notice_s2c",
	"2001":"user_joinScene_c2s",
	"2002":"user_joinScene_s2c",
	"2003":"obj_join_s2c",
	"2004":"obj_leave_s2c",
	"2005":"player_walk_c2s",
	"2006":"obj_walk_s2c",
	"2007":"obj_walk_stop_s2c",
	"1500":"user_chat_c2s",
	"1501":"user_chat_s2c"
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