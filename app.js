
process.argv[0] = '0';
process.argv[1] = '1';
process.argv[2] = '-e';
process.argv[3] = 'development';
process.argv[4] = '-g';
process.argv[5] = 1;
//require('./app/servers/gate/gate.js');
//require('./app/servers/log/log.js');
//require('./app/servers/db/db.js');
//require('./app/servers/chat/chat.js');
//require('./app/servers/login/login.js');
require('./app/servers/game/game.js');
