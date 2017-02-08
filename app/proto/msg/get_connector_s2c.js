/**
 * Created by yangsong on 16/1/24.
 */

var ByteBuffer = require('../../../libs/proto/ByteBuffer.js');
var Msg = require('../../../libs/proto/Msg.js');



function get_connector_s2c(){
	this.msgId = 502;
	this.ip = '';
	this.port = '';

}

get_connector_s2c.prototype.encode = function(){
    var buff = new ByteBuffer();
	Msg.encode(buff, 'ushort', this.msgId);
	Msg.encode(buff, 'string', this.ip);
	Msg.encode(buff, 'string', this.port);

    var result = buff.pack();
    buff = null;
    return result;
}

get_connector_s2c.prototype.decode = function(ba){
    var buff = new ByteBuffer(ba);
	this.msgId = Msg.decode(buff, 'ushort');
	this.ip = Msg.decode(buff, 'string');
	this.port = Msg.decode(buff, 'string');

    buff = null;
}


module.exports = get_connector_s2c;