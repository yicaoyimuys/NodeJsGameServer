/**
 * Created by yangsong on 16/1/24.
 */

var ByteBuffer = require('../../../libs/proto/ByteBuffer.js');
var Msg = require('../../../libs/proto/Msg.js');



function rpc_sendToGateByAll_c2s(){
	this.msgId = 209;
	this.msgBody = null;

}

rpc_sendToGateByAll_c2s.prototype.encode = function(){
    var buff = new ByteBuffer();
	Msg.encode(buff, 'ushort', this.msgId);
	Msg.encode(buff, 'buffer', this.msgBody);

    var result = buff.pack();
    buff = null;
    return result;
}

rpc_sendToGateByAll_c2s.prototype.decode = function(ba){
    var buff = new ByteBuffer(ba);
	this.msgId = Msg.decode(buff, 'ushort');
	this.msgBody = Msg.decode(buff, 'buffer');

    buff = null;
}


module.exports = rpc_sendToGateByAll_c2s;