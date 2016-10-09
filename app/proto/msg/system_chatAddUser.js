/**
 * Created by yangsong on 16/1/24.
 */

var ByteBuffer = require('../../../libs/proto/ByteBuffer.js');
var Msg = require('../../../libs/proto/Msg.js');



function system_chatAddUser(){
	this.msgId = 10007;
	this.userSessionID = 0;
	this.userId = 0;
	this.userName = '';

}

system_chatAddUser.prototype.encode = function(){
    var buff = new ByteBuffer();
	Msg.encode(buff, 'ushort', this.msgId);
	Msg.encode(buff, 'int64', this.userSessionID);
	Msg.encode(buff, 'int64', this.userId);
	Msg.encode(buff, 'string', this.userName);

    return buff.pack();
}

system_chatAddUser.prototype.decode = function(ba){
    var buff = new ByteBuffer(ba);
	this.msgId = Msg.decode(buff, 'ushort');
	this.userSessionID = Msg.decode(buff, 'int64');
	this.userId = Msg.decode(buff, 'int64');
	this.userName = Msg.decode(buff, 'string');

}


module.exports = system_chatAddUser;