/**
 * Created by yangsong on 16/1/24.
 */

var ByteBuffer = require('../../../libs/proto/ByteBuffer.js');
var Msg = require('../../../libs/proto/Msg.js');



function rpc_userJoinWorld_s2c(){
	this.msgId = 214;
	this.result = 0;

}

rpc_userJoinWorld_s2c.prototype.encode = function(){
    var buff = new ByteBuffer();
	Msg.encode(buff, 'ushort', this.msgId);
	Msg.encode(buff, 'byte', this.result);

    var result = buff.pack();
    buff = null;
    return result;
}

rpc_userJoinWorld_s2c.prototype.decode = function(ba){
    var buff = new ByteBuffer(ba);
	this.msgId = Msg.decode(buff, 'ushort');
	this.result = Msg.decode(buff, 'byte');

    buff = null;
}


module.exports = rpc_userJoinWorld_s2c;