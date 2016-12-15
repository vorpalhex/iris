'use strict';
const _ = require('lodash'); //Lodash is our utility library, it does nice things for us
const requireDir = require('require-dir');
const commands = requireDir('.');
const bus = require(__dirname + '/../core/bus'); //our "bus" is where we get events from, like messages

let help = [];

module.exports = {
  register: ()=>{
    bus.subscribe('message.direct', activate); //we just want to activate on any direct messages
    for(var k in commands){
      let currentCmd = commands[k];
      if(currentCmd.help && typeof currentCmd.help === 'function') {
        let cmdHelp = currentCmd.help();
        if(!cmdHelp.aliases) cmdHelp.aliases = [];
        if(!cmdHelp.cmd) cmdHelp.cmd = k;
        if(!cmdHelp.description) cmdHelp.description = `provides ${k} command feature`;
        help.push(cmdHelp);
      }
    }
    help.push(module.exports.help());
  },
  help: ()=>{
    return {
      cmd: 'help',
      aliases: ['help', 'commands', 'assist', 'assistance'],
      description: 'provides a help screen',
      usage: 'help {cmd}'
    };
  }
}

let commandPhrases = [
  'help',
  'commands',
  'assist',
  'assistance'
];

function activate(eName, message){
  let msg = _.words(message.contents);

  if(!msg[0] || commandPhrases.indexOf(msg[0].toLowerCase()) === -1){
    return;
  }

  //handle general help
  if(!msg[1]) {
    let resp = 'Here are my commands:\n';
    resp+= '```';
    help.forEach((h)=>{
      resp += `${_.padEnd(h.cmd, 12)}   ${h.description}\n`
    });
    resp+='```';
    return message.respond(resp);
  }

  //handle help for a given command
  let searchCmd = msg[1];
  let resp = '```\n';
  for(let i = 0; i < help.length; i++){
    let currentCmd = help[i];
    if(currentCmd.cmd === searchCmd || currentCmd.aliases.includes(searchCmd)){
      //found it
      resp += `${_.padEnd(currentCmd.cmd, 12)}\t${currentCmd.usage || ''}\n`;
      if(currentCmd.aliases.length) resp+=`Aliases: ${currentCmd.aliases.join(', ')}\n`;
      resp +=`----
${_.capitalize(currentCmd.longDescription || currentCmd.description)}
`;

      resp+= '```';

      return message.respond(resp);
    }
  }
  //missed
  return message.respond(`Oh, hm, sorry, I can't find ${searchCmd}, did you spell it correctly ${message.user.displayName}?`);
}
