/**
 * Created by yangsong on 16/1/24.
 */

var ByteBuffer = require('../../../libs/proto/ByteBuffer.js');
var Msg = require('../../../libs/proto/Msg.js');



function system_rpcCall_s2c(){
	this.msgId = 102;
	this.rpcId = 0;
	this.msgBody = null;

}

system_rpcCall_s2c.prototype.encode = function(){
    var buff = new ByteBuffer();
	Msg.encode(buff, 'ushort', this.msgId);
	Msg.encode(buff, 'uint32', this.rpcId);
	Msg.encode(buff, 'buffer', this.msgBody);

    var result = buff.pack();
    buff = null;
    return result;
}

system_rpcCall_s2c.prototype.decode = function(ba){
    var buff = new ByteBuffer(ba);
	this.msgId = Msg.decode(buff, 'ushort');
	this.rpcId = Msg.decode(buff, 'uint32');
	this.msgBody = Msg.decode(buff, 'buffer');

    buff = null;
}


module.exports = system_rpcCall_s2c;