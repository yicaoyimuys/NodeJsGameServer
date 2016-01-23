/**
 * Created by yangsong on 16/1/24.
 */
var fs = require("fs");
var protoFile = "./app/proto/proto.json";
var protoFileJs = "./app/proto/proto.js";
var msgFilePath = "./app/proto/msg/";

var msgTemplate = fs.readFileSync("./libs/proto/template/msgTemplate.txt","utf-8");
var msgDicTemplate = fs.readFileSync("./libs/proto/template/msgProtoTemplate.txt","utf-8");

var msgProtoId = "";
var msgProtoDic = "";
var msgProtoRequire = "";
var requireStr = "";

clearFolder();
buildFile();
generateMsgDicFile();

function replaceAll(str, s1, s2) {
    var demo = str.replace(s1, s2);
    while (demo.indexOf(s1) != - 1)
        demo = demo.replace(s1, s2);
    return demo;
}

function generateMsgDicFile(){
    msgProtoDic = msgProtoDic.substr(0, msgProtoDic.length-2);
    var fileContent = msgDicTemplate.replace("$0", msgProtoRequire);
    fileContent = fileContent.replace("$1", msgProtoDic);
    fileContent = fileContent.replace("$2", msgProtoId);
    saveMsgDicFile(fileContent);
}

function buildFile(){
    var msgObj = JSON.parse(readProtoFile());
    for (var key in msgObj){
        generateMsgFile(key, msgObj[key]);
    }
}

function readProtoFile(){
    var str = fs.readFileSync(protoFile).toString();
    str = str.replace(/\/\/.*[\n\r]/g, "");
    return str;
}

function generateMsgFile(fileName, msgObj){
    msgProtoRequire += "Proto."+fileName+" = require('./msg/"+fileName+".js');\n";

    var fileContent = replaceAll(msgTemplate, "$1", fileName);
    var properties = "";
    var funEncode = "";
    var funDecode = "";
    requireStr = "";
    for(var key  in msgObj){
        var value = msgObj[key];
        properties += "\t" + getPropertyStr(fileName, key, value) + "\n";
        funEncode += "\t" + getEncodeStr(key, value) + "\n";
        funDecode += "\t" + getDecodeStr(key, value) + "\n";
    }
    fileContent = fileContent.replace("$0", requireStr);
    fileContent = fileContent.replace("$2", properties);
    fileContent = fileContent.replace("$3", funEncode);
    fileContent = fileContent.replace("$4", funDecode);
    saveFile(fileName, fileContent);
}

function getDecodeStr(key, value){
    if(key =="msgId"){
        return "this."+key+" = Msg.decode(buff, 'ushort');";
    } else if (value =="byte"
        || value =="short"
        || value =="ushort"
        || value =="int32"
        || value =="uint32"
        || value =="int64"
        || value =="float"
        || value =="double"
        || value =="string"){
        return "this."+key+" = Msg.decode(buff, '"+value+"');";
    } else if(value.indexOf("array") != -1){
        var arr = value.split("/");
        return "this."+key+" = Msg.decode(buff, '"+arr[0]+"', '"+arr[1]+"');";
    } else {
        return "this."+key+".decode(Msg.decode(buff, '"+value+"'));";
    }
}


function getPropertyStr(fileName, key, value){
    if(key == "msgId"){
        msgProtoDic += "\t\""+ value +"\":\"" + fileName +"\",\n";
        msgProtoId += "Proto.ID_"+fileName+" = "+value+";\n"
        return "this."+key+" = " + value + ";";
    } else if (value =="byte"
        || value =="short"
        || value =="ushort"
        || value =="int32"
        || value =="uint32"
        || value =="int64"
        || value =="float"
        || value =="double"){
        return "this."+key+" = 0;";
    } else if(value =="string"){
        return "this."+key+" = '';";
    } else if(value.indexOf("array") != -1){
        return "this."+key+" = [];";
    } else {
        requireStr += "var "+value+" = require('./"+value+".js');\n";
        return "this."+key+" = new "+value+"();";
    }
}

function getEncodeStr(key, value){
    if(key =="msgId"){
        return "Msg.encode(buff, 'ushort', this."+key+");";
    } else if (value =="byte"
        || value =="short"
        || value =="ushort"
        || value =="int32"
        || value =="uint32"
        || value =="int64"
        || value =="float"
        || value =="double"
        || value =="string"){
        return "Msg.encode(buff, '"+value+"', this."+key+");";
    } else if(value.indexOf("array") != -1){
        var arr = value.split("/");
        return "Msg.encode(buff, '"+arr[0]+"', this."+key+", '"+arr[1]+"');";
    } else {
        return "Msg.encode(buff, '"+value+"', this."+key+");";
    }
}

function clearFolder() {
    if (fs.existsSync(msgFilePath)) {
        files = fs.readdirSync(msgFilePath);
        files.forEach(function (file, index){
            var path = msgFilePath + file;
            fs.unlinkSync(path);
        });
    }
}

function saveFile(fileName, content){
    fs.writeFileSync(msgFilePath + fileName + ".js", content);
}

function saveMsgDicFile(content){
    fs.writeFileSync(protoFileJs, content);
}