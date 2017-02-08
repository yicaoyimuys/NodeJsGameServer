/**
 * Created by yangsong on 16/1/24.
 */

var ByteBuffer = require('../../../libs/proto/ByteBuffer.js');
var Msg = require('../../../libs/proto/Msg.js');



function error_notice_s2c(){
	this.msgId = 2000;
	this.errorCode = 0;

}

error_notice_s2c.prototype.encode = function(){
    var buff = new ByteBuffer();
	Msg.encode(buff, 'ushort', this.msgId);
	Msg.encode(buff, 'int32', this.errorCode);

    var result = buff.pack();
    buff = null;
    return result;
}

error_notice_s2c.prototype.decode = function(ba){
    var buff = new ByteBuffer(ba);
	this.msgId = Msg.decode(buff, 'ushort');
	this.errorCode = Msg.decode(buff, 'int32');

    buff = null;
}


module.exports = error_notice_s2c;