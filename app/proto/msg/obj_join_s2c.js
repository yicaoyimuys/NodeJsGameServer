/**
 * Created by yangsong on 16/1/24.
 */

var ByteBuffer = require('../../../libs/proto/ByteBuffer.js');
var Msg = require('../../../libs/proto/Msg.js');

var obj_info = require('./obj_info.js');


function obj_join_s2c(){
	this.msgId = 2003;
	this.obj = new obj_info();

}

obj_join_s2c.prototype.encode = function(){
    var buff = new ByteBuffer();
	Msg.encode(buff, 'ushort', this.msgId);
	Msg.encode(buff, 'obj_info', this.obj);

    var result = buff.pack();
    buff = null;
    return result;
}

obj_join_s2c.prototype.decode = function(ba){
    var buff = new ByteBuffer(ba);
	this.msgId = Msg.decode(buff, 'ushort');
	this.obj.decode(Msg.decode(buff, 'obj_info'));

    buff = null;
}


module.exports = obj_join_s2c;