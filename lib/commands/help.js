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
        help.push(cmd.help());
      }
    }
  },
  help: ()=>{
    return `help  show a list of commands and their details`;
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

  return message.respond(`My commands are as follows:
${JSON.stringify(help, null, 4)}`);
}
