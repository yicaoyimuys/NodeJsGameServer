/**
 * Created by egret on 16/10/20.
 */
var Coordinate = module.exports;

var SceneConst = require('../comm/sceneConst.js');

Coordinate.titleToScreen = function(titleX, titleY){
    var screenX = titleX * SceneConst.TITLE_W + SceneConst.TITLE_W * 0.5;
    var screenY = titleY * SceneConst.TITLE_H + SceneConst.TITLE_H * 0.5;
    return [screenX, screenY];
}

Coordinate.screenToTitle = function(screenX, screenY){
    var titleX = Math.floor(screenX / SceneConst.TITLE_W);
    var titleY = Math.floor(screenY / SceneConst.TITLE_H);
    return [titleX, titleY];
}

Coordinate.screenToCell = function(screenX, screenY){
    var cellX = Math.floor(screenX / SceneConst.CELL_W);
    var cellY = Math.floor(screenY / SceneConst.CELL_H);
    return [cellX, cellY];
}

Coordinate.titleToCell = function(titleX, titleY){
    var screenPoint = Coordinate.titleToScreen(titleX, titleY);
    return Coordinate.screenToCell(screenPoint[0], screenPoint[1]);
}