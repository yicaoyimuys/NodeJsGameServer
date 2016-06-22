/**
 * Created by yangsong on 16/1/24.
 */

var ByteBuffer = require('../../../libs/proto/ByteBuffer.js');
var Msg = require('../../../libs/proto/Msg.js');



function system_sendToGate(){
	this.msgId = 10003;
	this.userSessionID = 0;
	this.msgBody = null;

}

system_sendToGate.prototype.encode = function(){
    var buff = new ByteBuffer();
	Msg.encode(buff, 'ushort', this.msgId);
	Msg.encode(buff, 'int64', this.userSessionID);
	Msg.encode(buff, 'buffer', this.msgBody);

    return buff.pack();
}

system_sendToGate.prototype.decode = function(ba){
    var buff = new ByteBuffer(ba);
	this.msgId = Msg.decode(buff, 'ushort');
	this.userSessionID = Msg.decode(buff, 'int64');
	this.msgBody = Msg.decode(buff, 'buffer');

}


module.exports = system_sendToGate;