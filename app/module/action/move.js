/**
 * Created by egret on 16/10/21.
 */
var util = require('util');
var Action = require('./action.js');
var Coordinate = require('../coordinate.js');

function Move(opts){
    Action.call(this, opts);
}

util.inherits(Move, Action);

Move.prototype.init = function(opts) {
    Action.prototype.init.call(this, opts);

    this.scene = opts.scene;
    this.obj = opts.obj;
    this.speed = opts.speed;
    this.radian = opts.radian;
    this.time = opts.time;
    this.speedX = Math.cos(this.radian) * this.speed;
    this.speedY = Math.sin(this.radian) * this.speed;
    this.tickNumber = 0;
}

Move.prototype.update = function(){
    Action.prototype.update.call(this);

    this.tickNumber++;

    var time = Date.now() - this.time;

    var gotoX = this.obj.x + this.speedX*time/1000;
    var gotoY = this.obj.y + this.speedY*time/1000;

    gotoX = Math.max(gotoX, 0);
    gotoX = Math.min(gotoX, this.scene.width);
    gotoX = Math.floor(gotoX);

    gotoY = Math.max(gotoY, 0);
    gotoY = Math.min(gotoY, this.scene.height);
    gotoY = Math.floor(gotoY);

    if(this.obj.x == gotoX && this.obj.y == gotoY){
        this.finished = true;
        this.obj.moveAction = null;
        this.scene.aoi.noticeWalkStop(this.obj);
        return;
    }

    this.obj.x = gotoX;
    this.obj.y = gotoY;

    this.time = Date.now();

    if(this.tickNumber == 5){
        this.scene.aoi.noticeWalk(this.obj);
        this.scene.aoi.changeObj(this.obj);
        this.tickNumber = 0;
    }

    //console.log('move', this.obj.id, this.obj.x, this.obj.y);
};

module.exports = Move;