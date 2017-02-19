/**
 * Created by yangsong on 16/1/24.
 */
var Log = require('../../libs/log/log.js');

var Proto = module.exports;

Proto.rpc_helloServer_c2s = require('./msg/rpc_helloServer_c2s.js');
Proto.rpc_gateDispatch_c2s = require('./msg/rpc_gateDispatch_c2s.js');
Proto.rpc_sendToGate_c2s = require('./msg/rpc_sendToGate_c2s.js');
Proto.rpc_sendToGateByList_c2s = require('./msg/rpc_sendToGateByList_c2s.js');
Proto.rpc_sendToGateByAll_c2s = require('./msg/rpc_sendToGateByAll_c2s.js');
Proto.rpc_clientOffline_c2s = require('./msg/rpc_clientOffline_c2s.js');
Proto.rpc_userJoinWorld_c2s = require('./msg/rpc_userJoinWorld_c2s.js');
Proto.rpc_userJoinWorld_s2c = require('./msg/rpc_userJoinWorld_s2c.js');
Proto.rpc_userJoinGame_c2s = require('./msg/rpc_userJoinGame_c2s.js');
Proto.rpc_userJoinGame_s2c = require('./msg/rpc_userJoinGame_s2c.js');
Proto.rpc_userJoinChat_c2s = require('./msg/rpc_userJoinChat_c2s.js');
Proto.rpc_userJoinChat_s2c = require('./msg/rpc_userJoinChat_s2c.js');
Proto.rpc_userExitWorld_c2s = require('./msg/rpc_userExitWorld_c2s.js');
Proto.rpc_userExitWorld_s2c = require('./msg/rpc_userExitWorld_s2c.js');
Proto.rpc_userExitGame_c2s = require('./msg/rpc_userExitGame_c2s.js');
Proto.rpc_userExitGame_s2c = require('./msg/rpc_userExitGame_s2c.js');
Proto.rpc_userExitChat_c2s = require('./msg/rpc_userExitChat_c2s.js');
Proto.rpc_userExitChat_s2c = require('./msg/rpc_userExitChat_s2c.js');


Proto.ID_rpc_helloServer_c2s = 201;
Proto.ID_rpc_gateDispatch_c2s = 203;
Proto.ID_rpc_sendToGate_c2s = 205;
Proto.ID_rpc_sendToGateByList_c2s = 207;
Proto.ID_rpc_sendToGateByAll_c2s = 209;
Proto.ID_rpc_clientOffline_c2s = 211;
Proto.ID_rpc_userJoinWorld_c2s = 213;
Proto.ID_rpc_userJoinWorld_s2c = 214;
Proto.ID_rpc_userJoinGame_c2s = 215;
Proto.ID_rpc_userJoinGame_s2c = 216;
Proto.ID_rpc_userJoinChat_c2s = 217;
Proto.ID_rpc_userJoinChat_s2c = 218;
Proto.ID_rpc_userExitWorld_c2s = 219;
Proto.ID_rpc_userExitWorld_s2c = 220;
Proto.ID_rpc_userExitGame_c2s = 221;
Proto.ID_rpc_userExitGame_s2c = 222;
Proto.ID_rpc_userExitChat_c2s = 223;
Proto.ID_rpc_userExitChat_s2c = 224;


var dic = {
	"201":"rpc_helloServer_c2s",
	"203":"rpc_gateDispatch_c2s",
	"205":"rpc_sendToGate_c2s",
	"207":"rpc_sendToGateByList_c2s",
	"209":"rpc_sendToGateByAll_c2s",
	"211":"rpc_clientOffline_c2s",
	"213":"rpc_userJoinWorld_c2s",
	"214":"rpc_userJoinWorld_s2c",
	"215":"rpc_userJoinGame_c2s",
	"216":"rpc_userJoinGame_s2c",
	"217":"rpc_userJoinChat_c2s",
	"218":"rpc_userJoinChat_s2c",
	"219":"rpc_userExitWorld_c2s",
	"220":"rpc_userExitWorld_s2c",
	"221":"rpc_userExitGame_c2s",
	"222":"rpc_userExitGame_s2c",
	"223":"rpc_userExitChat_c2s",
	"224":"rpc_userExitChat_s2c"
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