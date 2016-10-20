/**
 * Created by egret on 16/10/20.
 */
var Scene = module.exports;

var SceneDataService = require('../data/sceneDataService.js');
var Server = require('../../libs/config/server.js');
var Log = require('../../libs/log/log.js');
var Global = require('../../libs/global/global.js');
var SceneInfo = require('../model/sceneInfo.js');
var SceneConst = require('../comm/sceneConst.js');
var Aoi = require('./aoi.js');

//初始化
Scene.init = function() {
    var sceneIds = Server.getScenes(Global.serverName);
    for(var i=0; i<sceneIds.length; i++){
        var id = sceneIds[i];

        var scene = new SceneInfo();
        scene.id = id;
        scene.width = 2000;
        scene.height = 1500;
        scene.cols = Math.floor(scene.width / SceneConst.TITLE_W);
        scene.rows = Math.floor(scene.height / SceneConst.TITLE_H);
        scene.aoi = new Aoi(scene.width, scene.height);
        SceneDataService.addScene(scene);
    }
}

Scene.addObj = function(scene, obj){
    var objKey = obj.getKey();
    scene.objs[objKey] = obj;
    scene.aoi.addObj(obj);

    obj.sceneId = scene.id;
    Log.debug("Scene " + scene.id + ' addObj：' + obj.name);
}

Scene.removeObj = function(obj){
    var sceneId = obj.sceneId;
    var objKey = obj.getKey();
    var scene = SceneDataService.getScene(sceneId);
    if(!scene){
        return;
    }

    scene.objs[objKey] = null;
    scene.aoi.removeObj(obj);

    obj.sceneId = -1;
    Log.debug("Scene " + scene.id + ' removeObj：' + obj.name);
}

Scene.getObj = function(sceneId, objType, objId){
    var key = objType + "-" + objId;
    var sceneInfo = SceneDataService.getScene(sceneId);
    if(sceneInfo){
        return sceneInfo.objs[key];
    }
    return null;
}