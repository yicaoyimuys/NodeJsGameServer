/**
 * Created by egret on 16/10/20.
 */
var SceneDataService = module.exports;

var scenes = {};

SceneDataService.addScene = function(scene){
    scenes[scene.id] = scene;
}

SceneDataService.getScene = function(sceneId){
    return scenes[sceneId];
}