/**
 * Created by yangsong on 16/1/24.
 */

var ByteBuffer = require('../../../libs/proto/ByteBuffer.js');
var Msg = require('../../../libs/proto/Msg.js');



function user_joinGame_c2s(){
	this.msgId = 2001;
	this.gameServer = '';

}

user_joinGame_c2s.prototype.encode = function(){
    var buff = new ByteBuffer();
	Msg.encode(buff, 'ushort', this.msgId);
	Msg.encode(buff, 'string', this.gameServer);

    return buff.pack();
}

user_joinGame_c2s.prototype.decode = function(ba){
    var buff = new ByteBuffer(ba);
	this.msgId = Msg.decode(buff, 'ushort');
	this.gameServer = Msg.decode(buff, 'string');

}


module.exports = user_joinGame_c2s;