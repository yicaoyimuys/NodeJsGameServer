/**
 * Created by yangsong on 16/1/24.
 */

var ByteBuffer = require('../../../libs/proto/ByteBuffer.js');
var Msg = require('../../../libs/proto/Msg.js');



function system_userExitChat(){
	this.msgId = 1012;
	this.userSessionId = 0;

}

system_userExitChat.prototype.encode = function(){
    var buff = new ByteBuffer();
	Msg.encode(buff, 'ushort', this.msgId);
	Msg.encode(buff, 'int64', this.userSessionId);

    return buff.pack();
}

system_userExitChat.prototype.decode = function(ba){
    var buff = new ByteBuffer(ba);
	this.msgId = Msg.decode(buff, 'ushort');
	this.userSessionId = Msg.decode(buff, 'int64');

}


module.exports = system_userExitChat;