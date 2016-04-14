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
		func app/servers/gate/gate.js
		func app/servers/login/login.js
		func app/servers/game/game.js
		func app/servers/chat/chat.js
		func app/servers/log/log.js
		func app/servers/db/db.js
	else
		func $1
fi