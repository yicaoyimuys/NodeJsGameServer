/**
 * Created by egret on 16/1/26.
 */
var Db = module.exports;
var DbConfig = require('../../config/db.json');

Db.get = function(dbName) {
    return DbConfig[dbName];
}