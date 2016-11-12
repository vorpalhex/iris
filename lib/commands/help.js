const _ = require('lodash'); //Lodash is our utility library, it does nice things for us
const requireDir = require('require-dir');
const commands = requireDir('.');
const bus = require(__dirname + '/../core/bus'); //our "bus" is where we get events from, like messages

let help = [];

module.exports = {
  register: ()=>{
    bus.subscribe('message.direct', activate); //we just want to activate on any direct messages
    for(var k in commands){
      let cmd = commands[k];
      if(cmd.help && typeof cmd.help === 'function') {
        let cmdHelp = cmd.help();
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
    let cmd = help[i];
    if(cmd.cmd === searchCmd || cmd.aliases.includes(searchCmd)){
      //found it
      resp += `${_.padEnd(cmd.cmd, 12)}\t${cmd.usage || ''}\n`;
      if(cmd.aliases.length) resp+=`Aliases: ${cmd.aliases.join(', ')}\n`;
      resp +=`----
${_.capitalize(cmd.longDescription || cmd.description)}
`;

      resp+= '```';

      return message.respond(resp);
    }
  }
  //missed
  return message.respond(`Oh, hm, sorry, I can't find ${searchCmd}, did you spell it correctly ${message.user.displayName}?`);
}
