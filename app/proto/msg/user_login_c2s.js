/**
 * Created by yangsong on 16/1/24.
 */

var ByteBuffer = require('../../../libs/proto/ByteBuffer.js');
var Msg = require('../../../libs/proto/Msg.js');

var userInfo = require('./userInfo.js');


function user_login_c2s(){
	this.msgId = 1000;
	this.account = '';
	this.a1 = 0;
	this.b1 = 0;
	this.b2 = 0;
	this.b3 = 0;
	this.b4 = 0;
	this.b5 = 0;
	this.b6 = 0;
	this.b7 = 0;
	this.c = new userInfo();

}

user_login_c2s.prototype.encode = function(){
    var buff = new ByteBuffer();
	Msg.encode(buff, 'ushort', this.msgId);
	Msg.encode(buff, 'string', this.account);
	Msg.encode(buff, 'int32', this.a1);
	Msg.encode(buff, 'byte', this.b1);
	Msg.encode(buff, 'short', this.b2);
	Msg.encode(buff, 'ushort', this.b3);
	Msg.encode(buff, 'int64', this.b4);
	Msg.encode(buff, 'uint32', this.b5);
	Msg.encode(buff, 'float', this.b6);
	Msg.encode(buff, 'double', this.b7);
	Msg.encode(buff, 'userInfo', this.c);

    return buff.pack();
}

user_login_c2s.prototype.decode = function(ba){
    var buff = new ByteBuffer(ba);
	this.msgId = Msg.decode(buff, 'ushort');
	this.account = Msg.decode(buff, 'string');
	this.a1 = Msg.decode(buff, 'int32');
	this.b1 = Msg.decode(buff, 'byte');
	this.b2 = Msg.decode(buff, 'short');
	this.b3 = Msg.decode(buff, 'ushort');
	this.b4 = Msg.decode(buff, 'int64');
	this.b5 = Msg.decode(buff, 'uint32');
	this.b6 = Msg.decode(buff, 'float');
	this.b7 = Msg.decode(buff, 'double');
	this.c.decode(Msg.decode(buff, 'userInfo'));

}


module.exports = user_login_c2s;