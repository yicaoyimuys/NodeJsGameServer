/**
 * Created by egret on 16/2/1.
 */
var msg = require("./CreateMessage.js");
var fs = require("fs");

function clearFolder() {
    if (fs.existsSync(msg.MsgFilePath)) {
        files = fs.readdirSync(msg.MsgFilePath);
        files.forEach(function (file, index){
            var path = msg.MsgFilePath + file;
            fs.unlinkSync(path);
        });
    }
}

clearFolder();