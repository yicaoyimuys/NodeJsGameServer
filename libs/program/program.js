/**
 * Created by yangsong on 16/1/23.
 */
var Program = require('commander');

Program
    .option('-g, --gameId <n>', 'An integer argument', parseInt)
    .parse(process.argv);

module.exports = Program;
