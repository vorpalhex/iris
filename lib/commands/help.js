'use strict';
const _ = require('lodash'); //Lodash is our utility library, it does nice things for us
const requireDir = require('require-dir');
const commands = requireDir('.');
const bus = require(__dirname + '/../core/bus'); //our "bus" is where we get events from, like messages

let help = [];

module.exports = {
  name: 'help',
  aliases: ['commands', 'assist', 'assistance'],
  description: 'provides a help screen',
  usage: 'help [cmd]',
  register,
  activate
}

function register() {
  for(var k in commands){
    let currentCmd = commands[k];

    help.push({
      aliases: currentCmd.aliases || [],
      name: currentCmd.name || '',
      description: currentCmd.description || `provides ${currentCmd.name} command feature`,
      longDescription: currentCmd.longDescription || '',
      usage: currentCmd.usage || `@iris ${currentCmd.name}`
    });
  }

  let {aliases, name, description, usage} = module.exports;

  help.push({
    aliases,
    name,
    description,
    usage,
    longDescription: ''
  });

  return true;
}

function activate(message, preprocess){
  //handle general help
  if(!preprocess.words[0]) {
    let resp = 'Here are my commands:\n';
    resp+= '```';
    help.forEach((h)=>{
      resp += `${_.padEnd(h.name, 12)}   ${h.description}\n`
    });
    resp+='```';
    return message.reply(resp);
  }

  //handle help for a given command
  let searchCmd = preprocess.words[0];
  let resp = '```\n';
  for(let i = 0; i < help.length; i++){
    let currentCmd = help[i];
    if(currentCmd.name === searchCmd || currentCmd.aliases.includes(searchCmd)){
      //found it
      resp += `${_.padEnd(currentCmd.name, 12)}\t${currentCmd.usage || ''}\n`;
      if(currentCmd.aliases.length) resp+=`Aliases: ${currentCmd.aliases.join(', ')}\n`;
      resp +=`----
${_.capitalize(currentCmd.longDescription || currentCmd.description)}
`;

      resp+= '```';

      return message.reply(resp);
    }
  }
  //missed
  return message.reply(`Oh, hm, sorry, I can't find ${searchCmd}, did you spell it correctly ${message.user.displayName}?`);
}
