/**
 * Created by egret on 16/10/21.
 */
var Timer = require('../../../libs/timer/timer.js');

function ActionManager(){
    this.actions = [];
    this.actionsLen = 0;

    this.delActions = [];
    this.addActions = [];

    Timer.setInterval(100, this.run.bind(this));
}

ActionManager.prototype.add = function(action){
    this.addActions.push(action);
}

ActionManager.prototype.remove = function(action){
    this.delActions.push(action);
}

ActionManager.prototype.run = function(){
    this._dealAdd();
    this._dealRemove();

    for(var i=0; i<this.actionsLen; i++){
        var action = this.actions[i];
        if(action.aborted){
            continue;
        }

        action.update();

        if(action.finished){
            this.remove(action);
        }
    }
}

ActionManager.prototype._dealAdd = function(){
    while(this.addActions.length){
        var action = this.addActions.shift();
        var index = this.actions.indexOf(action);
        if(index != -1){
            continue;
        }
        this.actions.push(action);
        this.actionsLen++;
    }
}

ActionManager.prototype._dealRemove = function(){
    while(this.delActions.length){
        var action = this.delActions.pop();
        var index = this.actions.indexOf(action);
        if(index == -1){
            continue;
        }
        this.actions.splice(index, 1);
        this.actionsLen--;
    }
}

module.exports = ActionManager;