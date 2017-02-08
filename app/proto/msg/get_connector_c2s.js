/**
 * Created by yangsong on 16/1/24.
 */

var ByteBuffer = require('../../../libs/proto/ByteBuffer.js');
var Msg = require('../../../libs/proto/Msg.js');



function get_connector_c2s(){
	this.msgId = 501;
	this.userId = '';

}

get_connector_c2s.prototype.encode = function(){
    var buff = new ByteBuffer();
	Msg.encode(buff, 'ushort', this.msgId);
	Msg.encode(buff, 'string', this.userId);

    var result = buff.pack();
    buff = null;
    return result;
}

get_connector_c2s.prototype.decode = function(ba){
    var buff = new ByteBuffer(ba);
	this.msgId = Msg.decode(buff, 'ushort');
	this.userId = Msg.decode(buff, 'string');

    buff = null;
}


module.exports = get_connector_c2s;