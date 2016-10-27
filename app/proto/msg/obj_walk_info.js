/**
 * Created by yangsong on 16/1/24.
 */

var ByteBuffer = require('../../../libs/proto/ByteBuffer.js');
var Msg = require('../../../libs/proto/Msg.js');



function obj_walk_info(){
	this.time = 0;
	this.x = 0;
	this.y = 0;
	this.speed = 0;
	this.radian = 0;

}

obj_walk_info.prototype.encode = function(){
    var buff = new ByteBuffer();
	Msg.encode(buff, 'int64', this.time);
	Msg.encode(buff, 'ushort', this.x);
	Msg.encode(buff, 'ushort', this.y);
	Msg.encode(buff, 'ushort', this.speed);
	Msg.encode(buff, 'float', this.radian);

    return buff.pack();
}

obj_walk_info.prototype.decode = function(ba){
    var buff = new ByteBuffer(ba);
	this.time = Msg.decode(buff, 'int64');
	this.x = Msg.decode(buff, 'ushort');
	this.y = Msg.decode(buff, 'ushort');
	this.speed = Msg.decode(buff, 'ushort');
	this.radian = Msg.decode(buff, 'float');

}


module.exports = obj_walk_info;