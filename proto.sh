#!/bin/sh

node libs/proto/ClearMsg.js

node libs/proto/CreateMessage.js -p systemProto
node libs/proto/CreateMessage.js -p gameProto
node libs/proto/CreateMessage.js -p rpcProto