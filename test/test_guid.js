/**
 * Created by egret on 16/1/26.
 */

var Guid = require('../libs/guid/guid.js');

var userGuid = new Guid(1);
var arr = [];
for(var i=0; i< 200000 ;i++){
    userGuid.serverId = Math.floor(Math.random()*4000);
    var a = userGuid.newId();
    if(arr.indexOf(a) != -1){
        console.log("what??", a);
    }else{
        arr.push(a);
        console.log(a);
    }
}
