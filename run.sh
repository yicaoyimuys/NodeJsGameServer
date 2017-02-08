#!/bin/sh

sh stop.sh

node app/servers/gate/gate.js -e development &
sleep 1
node app/servers/connector/connector.js -e development -c 1 &
sleep 1
node app/servers/connector/connector.js -e development -c 2 &
sleep 1
node app/servers/connector/connector.js -e development -c 3 &
sleep 1
node app/servers/connector/connector.js -e development -c 4 &
sleep 1
node app/servers/log/log.js -e development &
sleep 1
node app/servers/db/db.js -e development &
sleep 1
node app/servers/world/world.js -e development &
sleep 1
node app/servers/chat/chat.js -e development &
sleep 1
node app/servers/login/login.js -e development &
sleep 1
node app/servers/game/game.js -e development -g 1 &
sleep 1
node app/servers/game/game.js -e development -g 2 &
sleep 1
node app/servers/game/game.js -e development -g 3