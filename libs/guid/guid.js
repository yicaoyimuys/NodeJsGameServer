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
        if (this.sequence > 4095) {
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

    return ((timestamp << 24) | (this.serverId << 12) | this.sequence) >>> 0;
}

module.exports = Guid;
