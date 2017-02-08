/**
 * Created by egret on 16/10/20.
 */
var Log = require('../../libs/log/log.js');
var AoiCellInfo = require('../model/aoiCellInfo.js');
var SceneConst = require('../comm/sceneConst.js');
var ObjType = require('../comm/objType.js');
var GameProto = require('../proto/gameProto.js');
var BackMessage = require('../message/backMessage.js');
var GameDataService = require('../data/gameDataService.js');
var Coordinate = require('./coordinate.js');

function Aoi(width, height){
    this.cols = Math.ceil(width / SceneConst.CELL_W);
    this.rows = Math.ceil(height / SceneConst.CELL_H);
    this.cells = [];
    this.init();
}

Aoi.prototype.init = function(){
    for(var x=0; x<this.cols; x++){
        for(var y=0; y<this.rows; y++){
            var aoiCell = new AoiCellInfo(x, y);
            aoiCell.objs[ObjType.PLAYER] = [];
            aoiCell.objs[ObjType.NPC] = [];
            aoiCell.objs[ObjType.ENEMY] = [];

            if(!this.cells[x]){
                this.cells[x] = [];
            }
            this.cells[x][y] = aoiCell;
        }
    }
}

Aoi.prototype.noticeWalk = function(obj){
    var sendMsg = new GameProto.obj_walk_s2c();
    sendMsg.type = obj.type;
    sendMsg.id = obj.id;
    sendMsg.data.time = obj.moveAction.time;
    sendMsg.data.x = obj.x;
    sendMsg.data.y = obj.y;
    sendMsg.data.speed = obj.moveAction.speed;
    sendMsg.data.radian = obj.moveAction.radian;
    this._notice(obj, sendMsg);
}

Aoi.prototype.noticeWalkStop = function(obj){
    var sendMsg = new GameProto.obj_walk_stop_s2c();
    sendMsg.type = obj.type;
    sendMsg.id = obj.id;
    sendMsg.x = obj.x;
    sendMsg.y = obj.y;
    this._notice(obj, sendMsg);
}

Aoi.prototype._notice = function(obj, sendMsg, aoiCell){
    if(!aoiCell){
        aoiCell = this.getCell(obj.aoiCellX, obj.aoiCellY);
    }

    if(!aoiCell){
        return;
    }

    //周围9个格子
    var minX = aoiCell.x - 1;
    var maxX = aoiCell.x + 1;
    var minY = aoiCell.y - 1;
    var maxY = aoiCell.y + 1;
    var players = this.getNearbyCellObjs(ObjType.PLAYER, minX, maxX, minY, maxY);
    var sessionList = [];
    players.forEach(function(objId){
        var sessionId = GameDataService.getUserSessionId(objId);
        sessionId && sessionList.push(sessionId);
    });

    //发送消息
    BackMessage.sendToConnectorByList(sessionList, sendMsg);
}

Aoi.prototype.addObj = function(obj){
    if(obj.aoiCellX != -1){
        Log.warn('aoi中重复添加obj');
        return;
    }

    var objType = obj.type;
    var objId = obj.id;
    var cellPoint = Coordinate.screenToCell(obj.x, obj.y);
    var cellX = cellPoint[0];
    var cellY = cellPoint[1];
    var aoiCell = this.getCell(cellX, cellY);
    if(!aoiCell){
        return;
    }

    //通知(不包含自己)
    this._noticeAddObj(obj, aoiCell);

    aoiCell.objs[objType].push(objId);
    obj.aoiCellX = cellX;
    obj.aoiCellY = cellY;
}

Aoi.prototype._noticeAddObj = function(obj, aoiCell){
    //通知obj进入
    var sendMsg = new GameProto.obj_join_s2c();
    sendMsg.obj.type = obj.type;
    sendMsg.obj.id = obj.id;
    sendMsg.obj.name = obj.name;
    sendMsg.obj.x = obj.x;
    sendMsg.obj.y = obj.y;
    this._notice(obj, sendMsg, aoiCell);
}

Aoi.prototype.removeObj = function(obj){
    var objType = obj.type;
    var objId = obj.id;
    var cellX = obj.aoiCellX;
    var cellY = obj.aoiCellY;
    var aoiCell = this.getCell(cellX, cellY);
    if(!aoiCell) {
        return;
    }

    var index = aoiCell.objs[objType].indexOf(objId);
    if(index == -1){
        return;
    }

    aoiCell.objs[objType].splice(index, 1);
    obj.aoiCellX = -1;
    obj.aoiCellY = -1;

    //通知(不包含自己)
    this._noticeRemoveObj(obj, cellX, cellY);
}

Aoi.prototype._noticeRemoveObj = function(obj, aoiCell){
    //通知obj离开
    var sendMsg = new GameProto.obj_leave_s2c();
    sendMsg.type = obj.type;
    sendMsg.id = obj.id;
    this._notice(obj, sendMsg, aoiCell);
}

Aoi.prototype.getCell = function(cellX, cellY){
    if(this.cells[cellX]){
        return this.cells[cellX][cellY];
    }
    return null;
}

Aoi.prototype.changeObj = function(obj){
    var oldCellX = obj.aoiCellX;
    var oldCellY = obj.aoiCellY;

    var cellPoint = Coordinate.screenToCell(obj.x, obj.y);
    var newCellX = cellPoint[0];
    var newCellY = cellPoint[1];

    //没变化
    if(oldCellX == newCellX && oldCellY == newCellY){
        return;
    }

    var objType = obj.type;
    var objId = obj.id;
    var oldCell = this.getCell(oldCellX, oldCellY);
    var newCell = this.getCell(newCellX, newCellY);
    if(!oldCell || !newCell){
        return;
    }

    //从老的中移除
    var index = oldCell.objs[objType].indexOf(objId);
    oldCell.objs[objType].splice(index, 1);
    obj.aoiCellX = -1;
    obj.aoiCellY = -1;

    //通知(不包含自己)
    this._noticeChangeObj(obj, oldCell, newCell);

    //加入到新的中
    newCell.objs[objType].push(objId);
    obj.aoiCellX = newCellX;
    obj.aoiCellY = newCellY;

    //console.log('aoi变动', objId, oldCellX, oldCellY, newCellX, newCellY);
}

Aoi.prototype._noticeChangeObj = function(obj, oldCell, newCell){
    //通知移除
    var minX = oldCell.x - (newCell.x - oldCell.x);
    var maxX = minX;
    var minY = oldCell.y - (newCell.y - oldCell.y);
    var maxY = minY;
    var players = this.getNearbyCellObjs(ObjType.PLAYER, minX, maxX, minY, maxY);
    var sessionList = [];
    players.forEach(function(objId){
        var sessionId = GameDataService.getUserSessionId(objId);
        sessionId && sessionList.push(sessionId);
    });

    //通知obj离开
    var sendMsg = new GameProto.obj_leave_s2c();
    sendMsg.type = obj.type;
    sendMsg.id = obj.id;
    BackMessage.sendToConnectorByList(sessionList, sendMsg);



    //通知添加
    var minX = newCell.x + (newCell.x - oldCell.x);
    var maxX = minX;
    var minY = newCell.y + (newCell.y - oldCell.y);
    var maxY = minY;
    var players = this.getNearbyCellObjs(ObjType.PLAYER, minX, maxX, minY, maxY);
    var sessionList = [];
    players.forEach(function(objId){
        var sessionId = GameDataService.getUserSessionId(objId);
        sessionId && sessionList.push(sessionId);
    });

    //通知obj进入
    var sendMsg = new GameProto.obj_join_s2c();
    sendMsg.obj.type = obj.type;
    sendMsg.obj.id = obj.id;
    sendMsg.obj.name = obj.name;
    sendMsg.obj.x = obj.x;
    sendMsg.obj.y = obj.y;
    BackMessage.sendToConnectorByList(sessionList, sendMsg);
}

Aoi.prototype.getNearbyCellObjs = function(objType, minX, maxX, minY, maxY){
    var result = [];
    for(var i=minX; i<=maxX; i++){
        for(var j=minY; j<=maxY; j++){
            var aoiCell = this.getCell(i, j);
            if(!aoiCell){
                continue;
            }
            result = result.concat(aoiCell.objs[objType]);
        }
    }
    return result;
}

module.exports = Aoi;