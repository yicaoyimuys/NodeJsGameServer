/**
 * Created by yangsong on 16/1/24.
 */

var ByteBuffer = require('../../../libs/proto/ByteBuffer.js');
var Msg = require('../../../libs/proto/Msg.js');



function system_sendToGateByList(){
	this.msgId = 1004;
	this.userSessionList = [];
	this.msgBody = null;

}

system_sendToGateByList.prototype.encode = function(){
    var buff = new ByteBuffer();
	Msg.encode(buff, 'ushort', this.msgId);
	Msg.encode(buff, 'array', this.userSessionList, 'int64');
	Msg.encode(buff, 'buffer', this.msgBody);

    return buff.pack();
}

system_sendToGateByList.prototype.decode = function(ba){
    var buff = new ByteBuffer(ba);
	this.msgId = Msg.decode(buff, 'ushort');
	this.userSessionList = Msg.decode(buff, 'array', 'int64');
	this.msgBody = Msg.decode(buff, 'buffer');

}


module.exports = system_sendToGateByList;