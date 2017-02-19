/**
 * Created by yangsong on 16/1/24.
 */

var ByteBuffer = require('../../../libs/proto/ByteBuffer.js');
var Msg = require('../../../libs/proto/Msg.js');



function rpc_helloServer_c2s(){
	this.msgId = 201;
	this.serverName = '';

}

rpc_helloServer_c2s.prototype.encode = function(){
    var buff = new ByteBuffer();
	Msg.encode(buff, 'ushort', this.msgId);
	Msg.encode(buff, 'string', this.serverName);

    var result = buff.pack();
    buff = null;
    return result;
}

rpc_helloServer_c2s.prototype.decode = function(ba){
    var buff = new ByteBuffer(ba);
	this.msgId = Msg.decode(buff, 'ushort');
	this.serverName = Msg.decode(buff, 'string');

    buff = null;
}


module.exports = rpc_helloServer_c2s;