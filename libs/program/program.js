/**
 * Created by yangsong on 16/1/23.
 */
var Program = require('commander');

Program
    .option('-g, --gameId <n>', 'game server id', parseInt)
    .option('-p, --protoFile <n>', 'proto file')
    .option('-e, --environment <n>', 'environment')
    .parse(process.argv);

module.exports = Program;
