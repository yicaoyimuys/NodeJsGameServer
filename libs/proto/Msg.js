/**
 * Created by Saco on 2015/2/8.
 */
var Msg = module.exports;

Msg.encode = function (buff, fieldType, fieldValue, arrayType) {
    if (fieldType == 'byte') {
        buff.byte(fieldValue);
    } else if (fieldType == 'short') {
        buff.short(fieldValue);
    } else if (fieldType == 'ushort') {
        buff.ushort(fieldValue);
    } else if (fieldType == 'int32') {
        buff.int32(fieldValue);
    } else if (fieldType == 'uint32') {
        buff.uint32(fieldValue);
    } else if (fieldType == 'int64') {
        buff.int64(fieldValue);
    }  else if (fieldType == 'string') {
        buff.string(fieldValue);
    } else if (fieldType == 'float') {
        buff.float(fieldValue);
    } else if (fieldType == 'double') {
        buff.double(fieldValue);
    } else if (fieldType == 'array') {
        Msg.encodeArray(buff, fieldValue, arrayType);
    } else if (fieldType == 'buffer') {
        buff.buff(fieldValue);
    } else {
        buff.buff(fieldValue.encode());
    }
}

Msg.decode = function (buff, fieldType, arrayType) {
    var list = null;
    if (fieldType == 'byte') {
        list = buff.byte().unpack();
    } else if (fieldType == 'short') {
        list = buff.short().unpack();
    } else if (fieldType == 'ushort') {
        list = buff.ushort().unpack();
    } else if (fieldType == 'int32') {
        list = buff.int32().unpack();
    } else if (fieldType == 'uint32') {
        list = buff.uint32().unpack();
    } else if (fieldType == 'int64') {
        list = buff.int64().unpack();
    }  else if (fieldType == 'string') {
        list = buff.string().unpack();
    } else if (fieldType == 'float') {
        list = buff.float().unpack();
    } else if (fieldType == 'double') {
        list = buff.double().unpack();
    } else if (fieldType == 'array') {
        return Msg.decodeArray(buff, arrayType);
    } else if (fieldType == 'buffer') {
        list = buff.buff().unpack();
    } else {
        list = buff.buff().unpack();
    }

    if(list){
        return list[list.length-1];
    }
}

Msg.decodeArray = function (buff, fieldtype) {
    var list = buff.short().unpack();
    var len = list[list.length - 1];
    var arr = [];
    for (var index = 0; index < len; index++) {
        arr.push(Msg.decode(buff, fieldtype));
    }
    return arr;
}

Msg.encodeArray = function (buff, fieldValue, arrayType) {
    var len = fieldValue.length;
    buff.short(len);
    for (var index = 0; index < len; index++) {
        Msg.encode(buff, arrayType, fieldValue[index]);
    }
}


