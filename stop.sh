#!/bin/sh
function func(){
	ps -ef|grep $1|grep -v grep|awk '{print $2}'|xargs kill -9
}

if [ $# -eq 0 ]
	then
		func app/servers/gate/gate.js
		func app/servers/login/login.js
		func app/servers/game/game.js
		func app/servers/chat/chat.js
		func app/servers/chat/world.js
		func app/servers/log/log.js
		func app/servers/db/db.js
	else
		func $1
fi