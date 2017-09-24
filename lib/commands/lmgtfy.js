'use strict';

function activate(message, preprocess) {
    message.reply(`https://lmgtfy.com/?q=${encodeURIComponent(preprocess.remainder)}`);
}

module.exports = {
  activate,
  name: 'lmgtfy',
  description: 'let me google that for you',
  aliases: []
};
