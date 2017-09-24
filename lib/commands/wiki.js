'use strict';
const _ = require('lodash');

function activate(message, preprocess) {

  if(!preprocess.remainder) {
    return message.respond(`Uhhh, I think you failed at Wikipedia.`);
  }

  message.reply(`https://en.wikipedia.org/wiki/${_.snakeCase(preprocess.remainder)}`);
}

module.exports = {
  activate,
  name: 'wiki',
  description: 'look something up on wikipedia',
  aliases: []
};
