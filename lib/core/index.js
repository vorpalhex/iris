const requiredir = require('require-dir');
const _ = require('lodash');

const models = requiredir(__dirname + '/../models');
const commands = requiredir(__dirname + '/../commands');

const log = require(__dirname + '/../util/log')();
let interfaces = requiredir(__dirname + '/../interfaces');

module.exports = {
  setup: ()=>{
    for(let commandName in commands) {
      let command = commands[commandName];
      if(command.register) command.register();
    }
  },
  connect: ()=>{
    for(let interfaceName in interfaces) {

      let interface = interfaces[interfaceName];

      if(interface.connect) interface.connect((err, success)=>{
        if(err) {
          log.warn(`Failed to connect to ${interfaceName}`, err);
          return;
        }

        log.info(`Connected to ${interfaceName}`);
      });
    }
  }
}
