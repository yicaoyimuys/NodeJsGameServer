/**
 * Created by yangsong on 16/1/24.
 */
var Log = require('../../libs/log/log.js');

var Proto = module.exports;

Proto.system_helloServer = require('./msg/system_helloServer.js');
Proto.system_gateDispatch = require('./msg/system_gateDispatch.js');
Proto.system_sendToGate = require('./msg/system_sendToGate.js');
Proto.system_sendToGateByList = require('./msg/system_sendToGateByList.js');
Proto.system_sendToGateByAll = require('./msg/system_sendToGateByAll.js');
Proto.system_clientOffline = require('./msg/system_clientOffline.js');
Proto.system_clientOnline = require('./msg/system_clientOnline.js');
Proto.system_sendToWorld = require('./msg/system_sendToWorld.js');
Proto.system_userJoinGame = require('./msg/system_userJoinGame.js');
Proto.system_userJoinChat = require('./msg/system_userJoinChat.js');
Proto.system_userExitGame = require('./msg/system_userExitGame.js');
Proto.system_userExitChat = require('./msg/system_userExitChat.js');


Proto.ID_system_helloServer = 1001;
Proto.ID_system_gateDispatch = 1002;
Proto.ID_system_sendToGate = 1003;
Proto.ID_system_sendToGateByList = 1004;
Proto.ID_system_sendToGateByAll = 1005;
Proto.ID_system_clientOffline = 1006;
Proto.ID_system_clientOnline = 1007;
Proto.ID_system_sendToWorld = 1008;
Proto.ID_system_userJoinGame = 1009;
Proto.ID_system_userJoinChat = 1010;
Proto.ID_system_userExitGame = 1011;
Proto.ID_system_userExitChat = 1012;


var dic = {
	"1001":"system_helloServer",
	"1002":"system_gateDispatch",
	"1003":"system_sendToGate",
	"1004":"system_sendToGateByList",
	"1005":"system_sendToGateByAll",
	"1006":"system_clientOffline",
	"1007":"system_clientOnline",
	"1008":"system_sendToWorld",
	"1009":"system_userJoinGame",
	"1010":"system_userJoinChat",
	"1011":"system_userExitGame",
	"1012":"system_userExitChat"
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