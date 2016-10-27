/**
 * Created by yangsong on 16/1/24.
 */

var ByteBuffer = require('../../../libs/proto/ByteBuffer.js');
var Msg = require('../../../libs/proto/Msg.js');

var obj_walk_info = require('./obj_walk_info.js');


function obj_walk_s2c(){
	this.msgId = 2006;
	this.type = 0;
	this.id = 0;
	this.data = new obj_walk_info();

}

obj_walk_s2c.prototype.encode = function(){
    var buff = new ByteBuffer();
	Msg.encode(buff, 'ushort', this.msgId);
	Msg.encode(buff, 'ushort', this.type);
	Msg.encode(buff, 'int64', this.id);
	Msg.encode(buff, 'obj_walk_info', this.data);

    return buff.pack();
}

obj_walk_s2c.prototype.decode = function(ba){
    var buff = new ByteBuffer(ba);
	this.msgId = Msg.decode(buff, 'ushort');
	this.type = Msg.decode(buff, 'ushort');
	this.id = Msg.decode(buff, 'int64');
	this.data.decode(Msg.decode(buff, 'obj_walk_info'));

}


module.exports = obj_walk_s2c;