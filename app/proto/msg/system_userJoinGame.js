/**
 * Created by yangsong on 16/1/24.
 */

var ByteBuffer = require('../../../libs/proto/ByteBuffer.js');
var Msg = require('../../../libs/proto/Msg.js');



function system_userJoinGame(){
	this.msgId = 109;
	this.userId = 0;
	this.userSessionId = 0;
	this.userConnectorServer = '';

}

system_userJoinGame.prototype.encode = function(){
    var buff = new ByteBuffer();
	Msg.encode(buff, 'ushort', this.msgId);
	Msg.encode(buff, 'int64', this.userId);
	Msg.encode(buff, 'int64', this.userSessionId);
	Msg.encode(buff, 'string', this.userConnectorServer);

    var result = buff.pack();
    buff = null;
    return result;
}

system_userJoinGame.prototype.decode = function(ba){
    var buff = new ByteBuffer(ba);
	this.msgId = Msg.decode(buff, 'ushort');
	this.userId = Msg.decode(buff, 'int64');
	this.userSessionId = Msg.decode(buff, 'int64');
	this.userConnectorServer = Msg.decode(buff, 'string');

    buff = null;
}


module.exports = system_userJoinGame;