/**
 * Created by yangsong on 16/1/24.
 */

var ByteBuffer = require('../../../libs/proto/ByteBuffer.js');
var Msg = require('../../../libs/proto/Msg.js');



function obj_walk_stop_s2c(){
	this.msgId = 2007;
	this.type = 0;
	this.id = 0;
	this.x = 0;
	this.y = 0;

}

obj_walk_stop_s2c.prototype.encode = function(){
    var buff = new ByteBuffer();
	Msg.encode(buff, 'ushort', this.msgId);
	Msg.encode(buff, 'ushort', this.type);
	Msg.encode(buff, 'int64', this.id);
	Msg.encode(buff, 'ushort', this.x);
	Msg.encode(buff, 'ushort', this.y);

    return buff.pack();
}

obj_walk_stop_s2c.prototype.decode = function(ba){
    var buff = new ByteBuffer(ba);
	this.msgId = Msg.decode(buff, 'ushort');
	this.type = Msg.decode(buff, 'ushort');
	this.id = Msg.decode(buff, 'int64');
	this.x = Msg.decode(buff, 'ushort');
	this.y = Msg.decode(buff, 'ushort');

}


module.exports = obj_walk_stop_s2c;