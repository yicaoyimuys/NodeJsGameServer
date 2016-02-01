/**
 * Created by egret on 16/1/26.
 */

var UserDao = module.exports;

var Global = require('../../libs/global/global.js');
var Utils = require('../../libs/util/utils.js');
var Server = require('../../libs/config/server.js');
var Guid = require('../../libs/guid/guid.js');
var MyDate = require('../../libs/date/date.js');
var DbUser = require('../model/dbUser.js');

var userGuid = new Guid(Server.getServerID());

UserDao.getUserByName = function (account, cb) {
    var sql = 'SELECT * FROM `user` WHERE `name` = ?';
    var args = [account];

    Global.userDb.query(sql, args, function(err, res){
        if (err) {
            Utils.invokeCallback(cb, err, null);
        } else {
            if (res && res.length == 1) {
                var rs = res[0];
                var dbUser = new DbUser();
                dbUser.id = rs.id;
                dbUser.name = rs.name;
                dbUser.money = rs.money;
                dbUser.create_time = rs.create_time;
                dbUser.last_login_time = rs.last_login_time;
                Utils.invokeCallback(cb, null, dbUser);
            } else {
                Utils.invokeCallback(cb, null, null);
            }
        }
    });
};

UserDao.createUser = function (dbUser, cb) {
    dbUser.id = userGuid.newId();
    dbUser.create_time = dbUser.last_login_time = MyDate.unix();

    var sql = 'INSERT INTO `user` (id, name, money, create_time, last_login_time) values (?, ?, ?, ?, ?)';
    var args = [dbUser.id, dbUser.name, dbUser.money, dbUser.create_time, dbUser.last_login_time];

    Global.userDb.query(sql, args, function(err, res){
        if (err) {
            Utils.invokeCallback(cb, err, null);
        } else {
            Utils.invokeCallback(cb, null, dbUser);
        }
    });
}

UserDao.updateUserLoginTime = function(dbUser){
    var sql = 'UPDATE `user` SET last_login_time = ? WHERE id = ?';
    var args = [dbUser.last_login_time, dbUser.id];
    Global.asyncUserDb.query(sql, args);
}