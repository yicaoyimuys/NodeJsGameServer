#!/bin/sh

node libs/proto/ClearMsg.js -p systemProto
node libs/proto/CreateMessage.js -p systemProto
node libs/proto/CreateMessage.js -p gameProto