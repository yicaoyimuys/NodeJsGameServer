/**
 * Created by egret on 16/10/20.
 */
var Log = require('../../libs/log/log.js');
var AoiCellInfo = require('../model/aoiCellInfo.js');
var SceneConst = require('../comm/sceneConst.js');
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
            if(!this.cells[x]){
                this.cells[x] = [];
            }
            this.cells[x][y] = aoiCell;
        }
    }
}

Aoi.prototype.addObj = function(obj){
    if(obj.aoiCellX != -1){
        Log.warn('aoi中重复添加obj');
        return;
    }

    var objKey = obj.getKey();
    var cellPoint = Coordinate.titleToCell(obj.x, obj.y);
    var cellX = cellPoint[0];
    var cellY = cellPoint[1];
    var aoiCell = this.getCell(cellX, cellY);
    if(!aoiCell){
        return;
    }

    aoiCell.objs.push(objKey);
    obj.aoiCellX = cellX;
    obj.aoiCellY = cellY;
}

Aoi.prototype.removeObj = function(obj){
    var objKey = obj.getKey();
    var cellX = obj.aoiCellX;
    var cellY = obj.aoiCellY;
    var aoiCell = this.getCell(cellX, cellY);
    if(!aoiCell) {
        return;
    }

    var index = aoiCell.objs.indexOf(objKey);
    if(index == -1){
        return;
    }

    aoiCell.objs.splice(index, 1);
    obj.aoiCellX = -1;
    obj.aoiCellY = -1;
}

Aoi.prototype.getCell = function(cellX, cellY){
    if(this.cells[cellX]){
        return this.cells[cellX][cellY];
    }
    return null;
}

module.exports = Aoi;