/**
 * Created by yangsong on 16/1/24.
 */

var ByteBuffer = require('../../../libs/proto/ByteBuffer.js');
var Msg = require('../../../libs/proto/Msg.js');



function user_chat_s2c(){
	this.msgId = 1501;
	this.chatMsg = '';
	this.fUserId = 0;
	this.fUserName = '';
	this.channel = 0;

}

user_chat_s2c.prototype.encode = function(){
    var buff = new ByteBuffer();
	Msg.encode(buff, 'ushort', this.msgId);
	Msg.encode(buff, 'string', this.chatMsg);
	Msg.encode(buff, 'int64', this.fUserId);
	Msg.encode(buff, 'string', this.fUserName);
	Msg.encode(buff, 'int32', this.channel);

    return buff.pack();
}

user_chat_s2c.prototype.decode = function(ba){
    var buff = new ByteBuffer(ba);
	this.msgId = Msg.decode(buff, 'ushort');
	this.chatMsg = Msg.decode(buff, 'string');
	this.fUserId = Msg.decode(buff, 'int64');
	this.fUserName = Msg.decode(buff, 'string');
	this.channel = Msg.decode(buff, 'int32');

}


module.exports = user_chat_s2c;