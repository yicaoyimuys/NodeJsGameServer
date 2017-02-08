/**
 * Created by yangsong on 16/1/24.
 */

var ByteBuffer = require('../../../libs/proto/ByteBuffer.js');
var Msg = require('../../../libs/proto/Msg.js');



function obj_leave_s2c(){
	this.msgId = 2004;
	this.type = 0;
	this.id = 0;

}

obj_leave_s2c.prototype.encode = function(){
    var buff = new ByteBuffer();
	Msg.encode(buff, 'ushort', this.msgId);
	Msg.encode(buff, 'ushort', this.type);
	Msg.encode(buff, 'int64', this.id);

    var result = buff.pack();
    buff = null;
    return result;
}

obj_leave_s2c.prototype.decode = function(ba){
    var buff = new ByteBuffer(ba);
	this.msgId = Msg.decode(buff, 'ushort');
	this.type = Msg.decode(buff, 'ushort');
	this.id = Msg.decode(buff, 'int64');

    buff = null;
}


module.exports = obj_leave_s2c;