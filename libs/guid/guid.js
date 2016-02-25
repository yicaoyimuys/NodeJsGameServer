/**
 * Created by egret on 16/1/26.
 */

var Log = require('../log/log.js');
var MyDate = require('../date/date.js');

function Guid(serverId) {
    if (serverId > 4095) {
        Log.error('server_id超出最大值')
        return;
    }

    this.serverId = serverId;
    this.sequence = 0;
    this.lastTimestamp = -1;
}

Guid.prototype.newId = function() {
    var timestamp = MyDate.unix();
    if (timestamp < this.lastTimestamp) {
        Log.error('请调整服务器时间!')
        return 0;
    }

    if (timestamp == this.lastTimestamp) {
        // 当前毫秒内，则+1
        this.sequence += 1;
        if (this.sequence >= 524287) {
            // 当前毫秒内计数满了，则等待下一秒
            this.sequence = 0;
            while(true) {
                timestamp = MyDate.unix();
                if (timestamp > this.lastTimestamp) {
                    break
                }
            }
        }
    } else {
        this.sequence = 0;
    }
    this.lastTimestamp = timestamp;

    //sequence(20) + timestamp(32) + serverId(12);
    var a = this.left(this.sequence, 44);
    var b = this.left(timestamp, 12);
    var c = this.left(this.serverId, 0);
    var d = this.residue(this.residue(a, b), c);
    //console.log(a, a.length);
    //console.log(b, b.length);
    //console.log(c, c.length);
    //console.log(d, d.length);
    return parseInt(d, 2);
}

Guid.prototype.residue = function(a, b){
    var result = "";
    for(var i=0; i<64; i++){
        var ai = a.substr(i, 1);
        var bi = b.substr(i, 1);
        if(ai == "1" || bi == "1"){
            result += "1";
        }
        else{
            result += "0";
        }
    }
    return result;
}

Guid.prototype.left = function(value, leftLen){
    var valueStr = value.toString(2);
    while(valueStr.length < 64){
        valueStr = "0" + valueStr;
    }
    while(leftLen > 0){
        valueStr = valueStr.substring(1, valueStr.length);
        valueStr += "0";
        leftLen--;
    }
    return valueStr;
}

module.exports = Guid;
