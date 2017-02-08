/**
 * Created by yangsong on 16/1/23.
 */
var Program = require('commander');

Program
    .option('-c, --connectorId <n>', 'connector server id', parseInt)
    .option('-g, --gameId <n>', 'game server id', parseInt)
    .option('-p, --protoFile <n>', 'proto file')
    .option('-e, --environment <n>', 'environment')
    .parse(process.argv);

module.exports = Program;
