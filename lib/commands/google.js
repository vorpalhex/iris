const _ = require('lodash');
const bus = require(__dirname + '/../core/bus');

function commandWordMatched(word) {
  let commandWords = [
    'goog',
    'google'
  ];

  return _.indexOf(commandWords, word.toLowerCase()) !== -1;
}

function generateUrlFromPhrase(phrase) {
    return 'https://google.com/search?q=' + encodeURIComponent(phrase);
}

function runCommand(eName, message) {
  let commandWord = message.contents.substr(0, message.contents.indexOf(' '));

  if (commandWordMatched(commandWord)) {
    let searchPhrase = message.contents.substr(message.contents.indexOf(' ') + 1);
    message.respond(message.user.displayName + ' ' + generateUrlFromPhrase(searchPhrase));
  }
}

module.exports = {
  register: ()=>{
    bus.subscribe('message.direct', runCommand);
  }
}
