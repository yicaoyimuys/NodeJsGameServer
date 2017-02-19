/**
 * Created by yangsong on 16/1/24.
 */
var Log = require('../../libs/log/log.js');

var Proto = module.exports;

Proto.system_rpcCall_c2s = require('./msg/system_rpcCall_c2s.js');
Proto.system_rpcCall_s2c = require('./msg/system_rpcCall_s2c.js');
Proto.system_rpcNotify_c2s = require('./msg/system_rpcNotify_c2s.js');


Proto.ID_system_rpcCall_c2s = 101;
Proto.ID_system_rpcCall_s2c = 102;
Proto.ID_system_rpcNotify_c2s = 103;


var dic = {
	"101":"system_rpcCall_c2s",
	"102":"system_rpcCall_s2c",
	"103":"system_rpcNotify_c2s"
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