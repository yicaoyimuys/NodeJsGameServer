var utils = module.exports;

// control variable of func "myPrint"
var isPrintFlag = false;
// var isPrintFlag = true;

/**
 * Check and invoke callback function
 */
utils.invokeCallback = function (cb) {
    if (!!cb && typeof cb === 'function') {
        cb.apply(null, Array.prototype.slice.call(arguments, 1));
    }
};

/**
 * clone an object
 */
utils.clone = function (origin) {
    if (!origin) {
        return;
    }

    var obj = {};
    for (var f in origin) {
        if (origin.hasOwnProperty(f)) {
            obj[f] = origin[f];
        }
    }
    return obj;
};

utils.size = function (obj) {
    if (!obj) {
        return 0;
    }

    var size = 0;
    for (var f in obj) {
        if (obj.hasOwnProperty(f)) {
            size++;
        }
    }

    return size;
};

// print the file name and the line number ~ begin
function getStack() {
    var orig = Error.prepareStackTrace;
    Error.prepareStackTrace = function (_, stack) {
        return stack;
    };
    var err = new Error();
    Error.captureStackTrace(err, arguments.callee);
    var stack = err.stack;
    Error.prepareStackTrace = orig;
    return stack;
}

function getFileName(stack) {
    return stack[1].getFileName();
}

function getLineNumber(stack) {
    return stack[1].getLineNumber();
}

utils.myPrint = function () {
    if (isPrintFlag) {
        var len = arguments.length;
        if (len <= 0) {
            return;
        }
        var stack = getStack();
        var aimStr = '\'' + getFileName(stack) + '\' @' + getLineNumber(stack) + ' :\n';
        for (var i = 0; i < len; ++i) {
            aimStr += arguments[i] + ' ';
        }
        console.log('\n' + aimStr);
    }
};

/**
 * ArrayBuffer转换为Buffer
 * @param data
 * @returns {Buffer}
 */
utils.arrayBufferToBuffer = function(data) {
    // data is either an ArrayBuffer or ArrayBufferView.
    var array = new Uint8Array(data.buffer || data)
        , l = data.byteLength || data.length
        , o = data.byteOffset || 0
        , buffer = new Buffer(l);
    for (var i = 0; i < l; ++i) {
        buffer[i] = array[o+i];
    }
    return buffer;
}

utils.packageBuffer = function(data) {
    var len = data.length;

    //写入2个字节表示本次包长
    var headBuf = new Buffer(2);
    headBuf.writeUInt16BE(len, 0);

    //写入包体
    var buffer = Buffer.concat([headBuf, data], 2 + len);
    return buffer;
}

