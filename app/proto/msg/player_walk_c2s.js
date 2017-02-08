/**
 * Created by yangsong on 16/1/24.
 */

var ByteBuffer = require('../../../libs/proto/ByteBuffer.js');
var Msg = require('../../../libs/proto/Msg.js');

var obj_walk_info = require('./obj_walk_info.js');


function player_walk_c2s(){
	this.msgId = 2005;
	this.data = new obj_walk_info();

}

player_walk_c2s.prototype.encode = function(){
    var buff = new ByteBuffer();
	Msg.encode(buff, 'ushort', this.msgId);
	Msg.encode(buff, 'obj_walk_info', this.data);

    var result = buff.pack();
    buff = null;
    return result;
}

player_walk_c2s.prototype.decode = function(ba){
    var buff = new ByteBuffer(ba);
	this.msgId = Msg.decode(buff, 'ushort');
	this.data.decode(Msg.decode(buff, 'obj_walk_info'));

    buff = null;
}


module.exports = player_walk_c2s;