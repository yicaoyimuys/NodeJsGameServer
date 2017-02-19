/**
 * Created by yangsong on 16/1/24.
 */

var ByteBuffer = require('../../../libs/proto/ByteBuffer.js');
var Msg = require('../../../libs/proto/Msg.js');



function client_ping_c2s(){
	this.msgId = 1000;

}

client_ping_c2s.prototype.encode = function(){
    var buff = new ByteBuffer();
	Msg.encode(buff, 'ushort', this.msgId);

    var result = buff.pack();
    buff = null;
    return result;
}

client_ping_c2s.prototype.decode = function(ba){
    var buff = new ByteBuffer(ba);
	this.msgId = Msg.decode(buff, 'ushort');

    buff = null;
}


module.exports = client_ping_c2s;