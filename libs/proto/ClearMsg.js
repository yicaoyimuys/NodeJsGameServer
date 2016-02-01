/**
 * Created by egret on 16/2/1.
 */
var msg = require("./CreateMessage.js");
var fs = require("fs");
var msgFilePath = "./app/proto/msg/";

function clearFolder() {
    if (fs.existsSync(msgFilePath)) {
        files = fs.readdirSync(msgFilePath);
        files.forEach(function (file, index){
            var path = msgFilePath + file;
            fs.unlinkSync(path);
        });
    }
}

clearFolder();