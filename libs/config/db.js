/**
 * Created by egret on 16/1/26.
 */
var Db = module.exports;

var Global = require('../global/global.js');
var DbConfig = require('../../config/db.json');

Db.get = function(dbName) {
    return DbConfig[Global.environment][dbName];
}