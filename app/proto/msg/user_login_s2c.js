/**
 * Created by yangsong on 16/1/24.
 */

var ByteBuffer = require('../../../libs/proto/ByteBuffer.js');
var Msg = require('../../../libs/proto/Msg.js');

var userInfo = require('./userInfo.js');


function user_login_s2c(){
	this.msgId = 1002;
	this.user = new userInfo();
	this.gameServer = '';

}

user_login_s2c.prototype.encode = function(){
    var buff = new ByteBuffer();
	Msg.encode(buff, 'ushort', this.msgId);
	Msg.encode(buff, 'userInfo', this.user);
	Msg.encode(buff, 'string', this.gameServer);

    return buff.pack();
}

user_login_s2c.prototype.decode = function(ba){
    var buff = new ByteBuffer(ba);
	this.msgId = Msg.decode(buff, 'ushort');
	this.user.decode(Msg.decode(buff, 'userInfo'));
	this.gameServer = Msg.decode(buff, 'string');

}


module.exports = user_login_s2c;