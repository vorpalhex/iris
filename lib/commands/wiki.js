'use strict';
const _ = require('lodash');

const bus = require(__dirname + '/../core/bus');
const log = require(__dirname + '/../util/log')();

function runCommand(eName, message) {
  let words = _.words(message.contents);
  if(!words.length || words[0].toLowerCase() !== 'wiki') return;

  let query = words.slice(1).join(' ');
  if(query.length < 1) {
    return message.respond(`Uhhh, I think you failed at Wikipedia there ${message.user.displayName}.`);
  }

  message.respond(`https://en.wikipedia.org/wiki/${_.snakeCase(query)}`);
}

module.exports = {
  register: ()=>{
    bus.subscribe('message.direct', runCommand);
    return true;
  },
  help: ()=>{
    return {
      cmd: 'wiki',
      description: 'look something up on wikipedia',
      aliases: []
    };
  }
};
