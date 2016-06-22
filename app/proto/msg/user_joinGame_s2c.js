/**
 * Created by yangsong on 16/1/24.
 */

var ByteBuffer = require('../../../libs/proto/ByteBuffer.js');
var Msg = require('../../../libs/proto/Msg.js');

var userInfo = require('./userInfo.js');


function user_joinGame_s2c(){
	this.msgId = 2002;
	this.user = new userInfo();

}

user_joinGame_s2c.prototype.encode = function(){
    var buff = new ByteBuffer();
	Msg.encode(buff, 'ushort', this.msgId);
	Msg.encode(buff, 'userInfo', this.user);

    return buff.pack();
}

user_joinGame_s2c.prototype.decode = function(ba){
    var buff = new ByteBuffer(ba);
	this.msgId = Msg.decode(buff, 'ushort');
	this.user.decode(Msg.decode(buff, 'userInfo'));

}


module.exports = user_joinGame_s2c;