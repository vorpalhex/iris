'use strict';
const updater = require('./updater');
const _ = require('lodash');
const commands = require(__dirname + '/../commands');
const bus = require('./bus');
const csplit = require('../util/commandSplit');

const conf = require(__dirname + '/../util/conf');
const log = require(__dirname + '/../util/log')();

const discord = require('./discord');

const activeCommands = new Map();

function registerCommand(command) {
  activeCommands.set(command.name, command);

  if (command.aliases) {
    command.aliases.forEach( (alias) => activeCommands.set(alias, command) );
  }
}

function setup() {
  for(let commandName in commands) {
    const command = commands[commandName];
    if (!command.name) command.name = commandName;

    if (command.register) {
      const status = command.register();

      if (!status) {
        log.warn(`${commandName} may not have loaded successfully.`);
      }

      if (status && command.activate) { //don't register commands that don't setup right
        registerCommand(command);
      }

    } else if (command.activate) { //but register commands with no setup
      registerCommand(command);
    }

  }

  if (conf.updater && conf.updater.enabled) {
    updater.setup();
  }
}

bus.subscribe('message.direct', (ename, message) => {
  const words = _.words(message.cleanContent);

  let commandWord = words[0];
  let commandLength = commandWord.length + 1;
  let commandCount = 0;

  if (commandWord == discord.client.user.username && words.length > 1) {
    commandWord = words[1];
    commandLength += commandWord.length + 1;
    commandCount++;
  }

  if ( activeCommands.has(commandWord) ) {
    const command = activeCommands.get(commandWord);

    const preprocessing = {
      words: words.slice(commandCount + 1),
      remainder: message.cleanContent.slice(commandLength).trim(),
      csplit: csplit(message.cleanContent)
    }

    return command.activate(message, preprocessing);
  } else {
    //oops, not a command we have!
    log.warn('Got an unrecognized command', commandWord);
    return message.reply(`Sorry, I don't understand that. Or, at least I don't have a command to run for it.`);
  }
});

module.exports = {
  setup,
  connect: discord.connect,
  disconnect: discord.disconnect,
  reconnect: discord.reconnect
}
