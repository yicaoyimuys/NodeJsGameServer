/**
 * Created by Administrator on 2016/8/3.
 */
var Crypto = module.exports;

var crypto = require('crypto');

Crypto.md5 = function (str) {
    var md5 = crypto.createHash('md5');
    md5.update(str);
    return md5.digest('hex');
};