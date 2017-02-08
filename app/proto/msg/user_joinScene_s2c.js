/**
 * Created by yangsong on 16/1/24.
 */

var ByteBuffer = require('../../../libs/proto/ByteBuffer.js');
var Msg = require('../../../libs/proto/Msg.js');

var obj_info = require('./obj_info.js');
var att_info = require('./att_info.js');


function user_joinScene_s2c(){
	this.msgId = 2002;
	this.player = new obj_info();
	this.att = new att_info();

}

user_joinScene_s2c.prototype.encode = function(){
    var buff = new ByteBuffer();
	Msg.encode(buff, 'ushort', this.msgId);
	Msg.encode(buff, 'obj_info', this.player);
	Msg.encode(buff, 'att_info', this.att);

    var result = buff.pack();
    buff = null;
    return result;
}

user_joinScene_s2c.prototype.decode = function(ba){
    var buff = new ByteBuffer(ba);
	this.msgId = Msg.decode(buff, 'ushort');
	this.player.decode(Msg.decode(buff, 'obj_info'));
	this.att.decode(Msg.decode(buff, 'att_info'));

    buff = null;
}


module.exports = user_joinScene_s2c;