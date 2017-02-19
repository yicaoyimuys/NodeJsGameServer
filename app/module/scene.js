/**
 * Created by egret on 16/10/20.
 */
var Scene = module.exports;

var SceneDataService = require('../data/sceneDataService.js');
var GameDataService = require('../data/gameDataService.js');
var Server = require('../../libs/config/server.js');
var Log = require('../../libs/log/log.js');
var Global = require('../../libs/global/global.js');
var SceneInfo = require('../model/sceneInfo.js');
var SceneConst = require('../comm/sceneConst.js');
var Aoi = require('./aoi.js');
var ActionMove = require('./action/move.js');
var ActionManager = require('./action/actionManager.js');

//初始化
Scene.init = function() {
    var sceneIds = Server.getScenes(Global.serverName);
    for(var i=0; i<sceneIds.length; i++){
        var id = sceneIds[i];

        var scene = new SceneInfo();
        scene.id = id;
        scene.width = 3000;
        scene.height = 2500;
        scene.cols = Math.floor(scene.width / SceneConst.TITLE_W);
        scene.rows = Math.floor(scene.height / SceneConst.TITLE_H);
        scene.aoi = new Aoi(scene.width, scene.height);
        scene.action = new ActionManager();
        SceneDataService.addScene(scene);
    }
}

Scene.walk = function(userSession, time, currX, currY, speed, radian){
    var userData = GameDataService.getUserBySession(userSession.id);
    if(!userData || !userData.player){
        return;
    }

    var obj = userData.player;
    var scene = SceneDataService.getScene(obj.sceneId);
    if(!scene){
        return;
    }

    var oldAction = obj.moveAction;
    if(oldAction){
        scene.action.remove(oldAction);
        obj.moveAction = null;
    }

    //当前位置检测与修正
    var deviationValue = 200;
    var deviationX = Math.abs(obj.x - currX);
    var deviationY = Math.abs(obj.y - currY);
    if(deviationX > deviationValue || deviationY > deviationValue){
        Log.warn('Scene.walk 位置偏移太大：uid: '+userData.id+', deviationX: '+deviationX+',deviationY:' + deviationY);
        return;
    }
    obj.x = currX;
    obj.y = currY;

    //停止移动
    if(speed == 0){
        scene.aoi.noticeWalkStop(obj);
    }
    //继续移动
    else{
        var action = new ActionMove({
            'scene': scene,
            'obj': obj,
            'speed': speed,
            'radian': radian,
            'time': time
        });
        scene.action.add(action);
        obj.moveAction = action;

        action.update();
        obj.moveAction && scene.aoi.noticeWalk(obj);
    }
}

Scene.addObj = function(scene, obj){
    var objKey = obj.getKey();
    scene.objs[objKey] = obj;
    scene.aoi.addObj(obj);

    obj.sceneId = scene.id;
    Log.debug("Scene " + scene.id + ' addObj：' + obj.name);

    //行走测试
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
    obj.moveAction && scene.action.remove(obj.moveAction);
    obj.moveAction = null;

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