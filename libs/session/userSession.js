/**
 * Created by egret on 16/1/21.
 */
var Log = require('../log/log.js');
var Utils = require('../util/utils.js');

function UserSession($id, $session){
    this.id = $id;
    this.session = $session;
    this.closeHandles = [];
    this.isClose = false;

    var self = this;
    this.session.addCloseCallBack(function(){
        self.close();
    });
}

UserSession.prototype.close = function(){
    if(this.isClose){
        return;
    }
    this.$destroy();
}

UserSession.prototype.addCloseCallBack = function(cb){
    if(this.isClose){
        return;
    }
    this.closeHandles.push(cb)
}

UserSession.prototype.$destroy = function() {
    this.isClose = true;

    for(var i= 0, len=this.closeHandles.length; i<len; i++){
        Utils.invokeCallback(this.closeHandles[i]);
    }
    this.closeHandles.length = 0;
    this.closeHandles = null;

    this.session = null;
}

module.exports = UserSession;