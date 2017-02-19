/**
 * Created by yangsong on 16/1/24.
 */

var ByteBuffer = require('../../../libs/proto/ByteBuffer.js');
var Msg = require('../../../libs/proto/Msg.js');



function rpc_sendToGateByList_c2s(){
	this.msgId = 207;
	this.userSessionIdList = [];
	this.msgBody = null;

}

rpc_sendToGateByList_c2s.prototype.encode = function(){
    var buff = new ByteBuffer();
	Msg.encode(buff, 'ushort', this.msgId);
	Msg.encode(buff, 'array', this.userSessionIdList, 'int64');
	Msg.encode(buff, 'buffer', this.msgBody);

    var result = buff.pack();
    buff = null;
    return result;
}

rpc_sendToGateByList_c2s.prototype.decode = function(ba){
    var buff = new ByteBuffer(ba);
	this.msgId = Msg.decode(buff, 'ushort');
	this.userSessionIdList = Msg.decode(buff, 'array', 'int64');
	this.msgBody = Msg.decode(buff, 'buffer');

    buff = null;
}


module.exports = rpc_sendToGateByList_c2s;