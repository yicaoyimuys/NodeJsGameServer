/**
 * Created by yangsong on 16/1/24.
 */

var ByteBuffer = require('../../../libs/proto/ByteBuffer.js');
var Msg = require('../../../libs/proto/Msg.js');



function user_chat_c2s(){
	this.msgId = 1500;
	this.chatMsg = '';
	this.channel = 0;

}

user_chat_c2s.prototype.encode = function(){
    var buff = new ByteBuffer();
	Msg.encode(buff, 'ushort', this.msgId);
	Msg.encode(buff, 'string', this.chatMsg);
	Msg.encode(buff, 'int32', this.channel);

    return buff.pack();
}

user_chat_c2s.prototype.decode = function(ba){
    var buff = new ByteBuffer(ba);
	this.msgId = Msg.decode(buff, 'ushort');
	this.chatMsg = Msg.decode(buff, 'string');
	this.channel = Msg.decode(buff, 'int32');

}


module.exports = user_chat_c2s;