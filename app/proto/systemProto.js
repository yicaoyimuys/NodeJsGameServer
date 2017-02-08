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


Proto.ID_system_helloServer = 101;
Proto.ID_system_gateDispatch = 102;
Proto.ID_system_sendToGate = 103;
Proto.ID_system_sendToGateByList = 104;
Proto.ID_system_sendToGateByAll = 105;
Proto.ID_system_clientOffline = 106;
Proto.ID_system_clientOnline = 107;
Proto.ID_system_sendToWorld = 108;
Proto.ID_system_userJoinGame = 109;
Proto.ID_system_userJoinChat = 110;
Proto.ID_system_userExitGame = 111;
Proto.ID_system_userExitChat = 112;


var dic = {
	"101":"system_helloServer",
	"102":"system_gateDispatch",
	"103":"system_sendToGate",
	"104":"system_sendToGateByList",
	"105":"system_sendToGateByAll",
	"106":"system_clientOffline",
	"107":"system_clientOnline",
	"108":"system_sendToWorld",
	"109":"system_userJoinGame",
	"110":"system_userJoinChat",
	"111":"system_userExitGame",
	"112":"system_userExitChat"
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