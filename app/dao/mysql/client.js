/**
 * Created by egret on 16/1/21.
 */
var Log = require('../../../libs/log/log.js');
var Utils = require('../../../libs/util/utils.js');
var Mysql = require('mysql');

function SqlClient(dbConfig){
	if(!dbConfig){
		Log.error('数据库配置不存在');
		return;
	}

	this.config = dbConfig;
	this.pool = Mysql.createPool(dbConfig);
	this.ping();
}

SqlClient.prototype.ping = function(){
	this.pool.getConnection(function(err, connection) {
		if (err) {
			Log.error('sql connect fail：' + err);
			return;
		}
		Log.info('sql connect success...')
		connection.release();
	})
}

SqlClient.prototype.query = function(sql, values, cb){
	this.pool.getConnection(function(err, connection) {
		if(err){
			Log.error('sql connect fail：' + err);
			return;
		}

		connection.query(sql, values, function(err, res) {
			connection.release();
			if(err){
				Log.error('执行sql语句['+sql+'; '+values+']错误：' + err);
			}
			//console.log(err, res);
			Utils.invokeCallback(cb, err, res);
		});
	});
}

module.exports = SqlClient;






