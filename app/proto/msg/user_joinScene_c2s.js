/**
 * Created by yangsong on 16/1/24.
 */

var ByteBuffer = require('../../../libs/proto/ByteBuffer.js');
var Msg = require('../../../libs/proto/Msg.js');



function user_joinScene_c2s(){
	this.msgId = 2001;
	this.sceneId = 0;

}

user_joinScene_c2s.prototype.encode = function(){
    var buff = new ByteBuffer();
	Msg.encode(buff, 'ushort', this.msgId);
	Msg.encode(buff, 'int32', this.sceneId);

    var result = buff.pack();
    buff = null;
    return result;
}

user_joinScene_c2s.prototype.decode = function(ba){
    var buff = new ByteBuffer(ba);
	this.msgId = Msg.decode(buff, 'ushort');
	this.sceneId = Msg.decode(buff, 'int32');

    buff = null;
}


module.exports = user_joinScene_c2s;