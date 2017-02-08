/**
 * Created by yangsong on 16/1/24.
 */

var ByteBuffer = require('../../../libs/proto/ByteBuffer.js');
var Msg = require('../../../libs/proto/Msg.js');



function system_userJoinChat(){
	this.msgId = 110;
	this.userId = 0;
	this.userSessionId = 0;
	this.userConnectorServer = '';
	this.userName = '';
	this.unionId = 0;

}

system_userJoinChat.prototype.encode = function(){
    var buff = new ByteBuffer();
	Msg.encode(buff, 'ushort', this.msgId);
	Msg.encode(buff, 'int64', this.userId);
	Msg.encode(buff, 'int64', this.userSessionId);
	Msg.encode(buff, 'string', this.userConnectorServer);
	Msg.encode(buff, 'string', this.userName);
	Msg.encode(buff, 'int32', this.unionId);

    var result = buff.pack();
    buff = null;
    return result;
}

system_userJoinChat.prototype.decode = function(ba){
    var buff = new ByteBuffer(ba);
	this.msgId = Msg.decode(buff, 'ushort');
	this.userId = Msg.decode(buff, 'int64');
	this.userSessionId = Msg.decode(buff, 'int64');
	this.userConnectorServer = Msg.decode(buff, 'string');
	this.userName = Msg.decode(buff, 'string');
	this.unionId = Msg.decode(buff, 'int32');

    buff = null;
}


module.exports = system_userJoinChat;