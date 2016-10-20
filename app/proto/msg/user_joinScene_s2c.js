/**
 * Created by yangsong on 16/1/24.
 */

var ByteBuffer = require('../../../libs/proto/ByteBuffer.js');
var Msg = require('../../../libs/proto/Msg.js');



function user_joinScene_s2c(){
	this.msgId = 2002;
	this.name = '';
	this.id = 0;
	this.x = 0;
	this.y = 0;
	this.attack = 0;
	this.defence = 0;

}

user_joinScene_s2c.prototype.encode = function(){
    var buff = new ByteBuffer();
	Msg.encode(buff, 'ushort', this.msgId);
	Msg.encode(buff, 'string', this.name);
	Msg.encode(buff, 'int64', this.id);
	Msg.encode(buff, 'int32', this.x);
	Msg.encode(buff, 'int32', this.y);
	Msg.encode(buff, 'int32', this.attack);
	Msg.encode(buff, 'int32', this.defence);

    return buff.pack();
}

user_joinScene_s2c.prototype.decode = function(ba){
    var buff = new ByteBuffer(ba);
	this.msgId = Msg.decode(buff, 'ushort');
	this.name = Msg.decode(buff, 'string');
	this.id = Msg.decode(buff, 'int64');
	this.x = Msg.decode(buff, 'int32');
	this.y = Msg.decode(buff, 'int32');
	this.attack = Msg.decode(buff, 'int32');
	this.defence = Msg.decode(buff, 'int32');

}


module.exports = user_joinScene_s2c;