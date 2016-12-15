"use strict";
const requiredir = require('require-dir');
const _ = require('lodash');

const updater = require('./updater');

const models = requiredir(__dirname + '/../models');
const commands = requiredir(__dirname + '/../commands');

const conf = require(__dirname + '/../util/conf');
const log = require(__dirname + '/../util/log')();
let interfaces = requiredir(__dirname + '/../interfaces');

module.exports = {
  setup: ()=>{
    for(let commandName in commands) {
      let command = commands[commandName];
      if(command.register) command.register();
    }

    if(conf.updater && conf.updater.enabled) {
      updater.setup();
    }
  },
  connect: ()=>{
    for(let interfaceName in interfaces) {

      let myInterface = interfaces[interfaceName];

      if(myInterface.connect) myInterface.connect((err, success)=>{
        if(err) {
          log.warn(`Failed to connect to ${interfaceName}`, err);
          return;
        }

        log.info(`Connected to ${interfaceName}`);
      });
    }
  },
  disconnect: ()=>{
    for(let interfaceName in interfaces) {

      let myInterface = interfaces[interfaceName];

      if(myInterface.disconnect) myInterface.disconnect((err, success)=>{
        if(err) {
          log.warn(`Failed to disconnect to ${interfaceName}`, err);
          return;
        }

        log.info(`Disconnected from ${interfaceName}`);
      });
    }
  }
}
