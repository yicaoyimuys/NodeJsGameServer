#!/bin/sh
function func(){
	killall -9 $1

	killall -0 $1
	while [ $? -ne 1 ]; do
		sleep 1
		killall -0 $1
	done
}

if [ $# -eq 0 ]
	then
		func node app/servers/gate/gate.js
		func node app/servers/login/login.js
		func node app/servers/game/game.js
		func node app/servers/chat/chat.js
		func node app/servers/log/log.js
		func node app/servers/db/db.js
	else
		func $1
fi