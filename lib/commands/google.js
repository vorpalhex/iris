'use strict';

function activate(message, preprocessing) {
  return message.reply(`Here ya go, https://google.com/search?q=${encodeURIComponent(preprocessing.remainder)}`);
}

module.exports = {
  activate,
  name: 'google',
  description: 'grab a google url for a query',
  aliases: ['goog']
}
