/**
 * Created by yangsong on 16/1/24.
 */

var ByteBuffer = require('../../../libs/proto/ByteBuffer.js');
var Msg = require('../../../libs/proto/Msg.js');



function userInfo(){
	this.userId = 0;
	this.userName = '';
	this.money = 0;
	this.createTime = 0;
	this.task = [];

}

userInfo.prototype.encode = function(){
    var buff = new ByteBuffer();
	Msg.encode(buff, 'int64', this.userId);
	Msg.encode(buff, 'string', this.userName);
	Msg.encode(buff, 'int32', this.money);
	Msg.encode(buff, 'int32', this.createTime);
	Msg.encode(buff, 'array', this.task, 'int32');

    return buff.pack();
}

userInfo.prototype.decode = function(ba){
    var buff = new ByteBuffer(ba);
	this.userId = Msg.decode(buff, 'int64');
	this.userName = Msg.decode(buff, 'string');
	this.money = Msg.decode(buff, 'int32');
	this.createTime = Msg.decode(buff, 'int32');
	this.task = Msg.decode(buff, 'array', 'int32');

}


module.exports = userInfo;