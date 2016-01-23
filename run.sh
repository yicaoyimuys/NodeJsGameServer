#!/bin/sh

sh stop.sh

node app/servers/gate/gate.js &
sleep 1
node app/servers/log/log.js &
sleep 1
node app/servers/chat/chat.js &
sleep 1
node app/servers/login/login.js &
sleep 1
node app/servers/game/game.js -g 1 &
sleep 1
node app/servers/game/game.js -g 2 &
sleep 1
node app/servers/game/game.js -g 3