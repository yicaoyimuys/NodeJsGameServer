/**
 * Created by egret on 16/10/21.
 */
var id = 1;

function Action(opts){
    this.init(opts);
}

Action.prototype.init = function(opts){
    this.id = id++;
    this.finished = false;
    this.aborted = false;
}

Action.prototype.update = function(){
};

module.exports = Action;