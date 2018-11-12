const rl = require('readline-sync');
const forever = require('forever-monitor');

const corpus_path = rl.question("Where is your text file?\n> ");

const child = new (forever.Monitor)('puppet.js', {args: [corpus_path]});

child.on("error", () => {console.log("restarting");child.start();});

child.start();
