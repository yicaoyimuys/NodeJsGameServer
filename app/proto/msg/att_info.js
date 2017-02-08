/**
 * Created by yangsong on 16/1/24.
 */

var ByteBuffer = require('../../../libs/proto/ByteBuffer.js');
var Msg = require('../../../libs/proto/Msg.js');



function att_info(){
	this.attack = 0;
	this.defence = 0;

}

att_info.prototype.encode = function(){
    var buff = new ByteBuffer();
	Msg.encode(buff, 'int32', this.attack);
	Msg.encode(buff, 'int32', this.defence);

    var result = buff.pack();
    buff = null;
    return result;
}

att_info.prototype.decode = function(ba){
    var buff = new ByteBuffer(ba);
	this.attack = Msg.decode(buff, 'int32');
	this.defence = Msg.decode(buff, 'int32');

    buff = null;
}


module.exports = att_info;