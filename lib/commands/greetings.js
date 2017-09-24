'use strict';

const _ = require('lodash');

//Here's a list of phrases we say back
let phrases = [
  'Greetings',
  'Hi',
  'Hello',
  'Sup',
  'Yo',
  'Hey'
];

//We use module.exports to make methods available to others
module.exports = {
  activate,
  cmd: 'hi',
  description: 'respond to greetings',
  aliases: ['hey', 'yo', 'sup', 'greetings', 'hello']
}

//We get called with two parameters, our own name and the rest of the message
function activate(message) {
  message.reply(`${_.sample(phrases)} ${message.author.username}`);
}
