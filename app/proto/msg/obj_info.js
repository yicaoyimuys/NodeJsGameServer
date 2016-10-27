/**
 * Created by yangsong on 16/1/24.
 */

var ByteBuffer = require('../../../libs/proto/ByteBuffer.js');
var Msg = require('../../../libs/proto/Msg.js');



function obj_info(){
	this.type = 0;
	this.id = 0;
	this.name = '';
	this.x = 0;
	this.y = 0;

}

obj_info.prototype.encode = function(){
    var buff = new ByteBuffer();
	Msg.encode(buff, 'ushort', this.type);
	Msg.encode(buff, 'int64', this.id);
	Msg.encode(buff, 'string', this.name);
	Msg.encode(buff, 'ushort', this.x);
	Msg.encode(buff, 'ushort', this.y);

    return buff.pack();
}

obj_info.prototype.decode = function(ba){
    var buff = new ByteBuffer(ba);
	this.type = Msg.decode(buff, 'ushort');
	this.id = Msg.decode(buff, 'int64');
	this.name = Msg.decode(buff, 'string');
	this.x = Msg.decode(buff, 'ushort');
	this.y = Msg.decode(buff, 'ushort');

}


module.exports = obj_info;