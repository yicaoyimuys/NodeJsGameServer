/**
 * Created by yangsong on 16/1/24.
 */

var ByteBuffer = require('../../../libs/proto/ByteBuffer.js');
var Msg = require('../../../libs/proto/Msg.js');



function system_clientOnline(){
	this.msgId = 1007;
	this.userId = 0;
	this.userSessionId = 0;
	this.userGameServer = '';

}

system_clientOnline.prototype.encode = function(){
    var buff = new ByteBuffer();
	Msg.encode(buff, 'ushort', this.msgId);
	Msg.encode(buff, 'int64', this.userId);
	Msg.encode(buff, 'int64', this.userSessionId);
	Msg.encode(buff, 'string', this.userGameServer);

    return buff.pack();
}

system_clientOnline.prototype.decode = function(ba){
    var buff = new ByteBuffer(ba);
	this.msgId = Msg.decode(buff, 'ushort');
	this.userId = Msg.decode(buff, 'int64');
	this.userSessionId = Msg.decode(buff, 'int64');
	this.userGameServer = Msg.decode(buff, 'string');

}


module.exports = system_clientOnline;