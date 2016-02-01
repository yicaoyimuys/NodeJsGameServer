/**
 * Created by yangsong on 16/1/24.
 */
var Log = require('../../libs/log/log.js');

var Proto = module.exports;

Proto.system_helloServer = require('./msg/system_helloServer.js');
Proto.system_gateDispatch = require('./msg/system_gateDispatch.js');
Proto.system_sendToGate = require('./msg/system_sendToGate.js');


Proto.ID_system_helloServer = 10001;
Proto.ID_system_gateDispatch = 10002;
Proto.ID_system_sendToGate = 10003;


var dic = {
	"10001":"system_helloServer",
	"10002":"system_gateDispatch",
	"10003":"system_sendToGate"
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