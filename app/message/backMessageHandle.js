/**
 * Created by yangsong on 16/1/24.
 */
var Global = require('../../libs/global/global.js');
var Proto = require('../proto/proto.js');

var BackMessageHandle = module.exports;

BackMessageHandle.handles = {};
BackMessageHandle.handles[Proto.ID_system_helloServer] = Global.addServerClient;