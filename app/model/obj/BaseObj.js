/**
 * Created by egret on 16/10/20.
 */
function BaseObj(){
    this.type = 0;
    this.id = 0;
    this.name = '';
    this.x = 0;
    this.y = 0;
    this.titleX = 0;
    this.titleY = 0;
    this.aoiCellX = -1;
    this.aoiCellY = -1;
    this.sceneId = -1;
}

BaseObj.prototype.getKey = function(){
    return this.type + "_" + this.id;
}

module.exports = BaseObj;