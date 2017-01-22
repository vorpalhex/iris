'use strict';
const _ = require('lodash');

const updater = require('./updater');

const models = require(__dirname + '/../models');
const commands = require(__dirname + '/../commands');

const conf = require(__dirname + '/../util/conf');
const log = require(__dirname + '/../util/log')();

const connectionManager = require('./connectionManager');

module.exports = {
  setup: ()=>{
    for(let commandName in commands) {
      let command = commands[commandName];
      if(command.register) {
        const status = command.register();
        if(!status) {
          log.warn(`${commandName} may not have loaded successfully.`);
        }
      }
    }

    if(conf.updater && conf.updater.enabled) {
      updater.setup();
    }
  },
  connect: connectionManager.connectAll,
  disconnect: connectionManager.disconnectAll
}
