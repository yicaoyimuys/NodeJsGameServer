/**
 * Created by yangsong on 16/1/24.
 */

var ByteBuffer = require('../../../libs/proto/ByteBuffer.js');
var Msg = require('../../../libs/proto/Msg.js');



function system_rpcNotify_c2s(){
	this.msgId = 103;
	this.msgBody = null;

}

system_rpcNotify_c2s.prototype.encode = function(){
    var buff = new ByteBuffer();
	Msg.encode(buff, 'ushort', this.msgId);
	Msg.encode(buff, 'buffer', this.msgBody);

    var result = buff.pack();
    buff = null;
    return result;
}

system_rpcNotify_c2s.prototype.decode = function(ba){
    var buff = new ByteBuffer(ba);
	this.msgId = Msg.decode(buff, 'ushort');
	this.msgBody = Msg.decode(buff, 'buffer');

    buff = null;
}


module.exports = system_rpcNotify_c2s;