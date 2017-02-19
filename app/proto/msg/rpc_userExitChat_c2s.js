/**
 * Created by yangsong on 16/1/24.
 */

var ByteBuffer = require('../../../libs/proto/ByteBuffer.js');
var Msg = require('../../../libs/proto/Msg.js');



function rpc_userExitChat_c2s(){
	this.msgId = 223;
	this.userSessionId = 0;

}

rpc_userExitChat_c2s.prototype.encode = function(){
    var buff = new ByteBuffer();
	Msg.encode(buff, 'ushort', this.msgId);
	Msg.encode(buff, 'int64', this.userSessionId);

    var result = buff.pack();
    buff = null;
    return result;
}

rpc_userExitChat_c2s.prototype.decode = function(ba){
    var buff = new ByteBuffer(ba);
	this.msgId = Msg.decode(buff, 'ushort');
	this.userSessionId = Msg.decode(buff, 'int64');

    buff = null;
}


module.exports = rpc_userExitChat_c2s;