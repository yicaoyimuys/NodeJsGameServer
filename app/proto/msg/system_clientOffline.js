/**
 * Created by yangsong on 16/1/24.
 */

var ByteBuffer = require('../../../libs/proto/ByteBuffer.js');
var Msg = require('../../../libs/proto/Msg.js');



function system_clientOffline(){
	this.msgId = 1006;
	this.userSessionID = 0;
	this.userGameServer = '';

}

system_clientOffline.prototype.encode = function(){
    var buff = new ByteBuffer();
	Msg.encode(buff, 'ushort', this.msgId);
	Msg.encode(buff, 'int64', this.userSessionID);
	Msg.encode(buff, 'string', this.userGameServer);

    return buff.pack();
}

system_clientOffline.prototype.decode = function(ba){
    var buff = new ByteBuffer(ba);
	this.msgId = Msg.decode(buff, 'ushort');
	this.userSessionID = Msg.decode(buff, 'int64');
	this.userGameServer = Msg.decode(buff, 'string');

}


module.exports = system_clientOffline;