const bus = require(__dirname + '/../core/bus');

function commandWordMatched(word) {
  return word && 'lmgtfy' === word.toLowerCase();
}

function generateUrlFromPhrase(phrase) {
    return 'https://lmgtfy.com/?q=' + encodeURIComponent(phrase);
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
  },
  help: ()=>{
    return {
      cmd: 'lmgtfy',
      description: 'let me google that for you',
      aliases: []
    };
  }
}
