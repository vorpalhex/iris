'use strict';
const _ = require('lodash');
const request = require('superagent');
const Promise = require('bluebird');

const bus = require(__dirname + '/../core/bus');
const log = require(__dirname + '/../util/log')();

const connectionManager = require(__dirname + '/../core/connectionManager');
const interfaces = require(__dirname + '/../interfaces');

const validTargets = [...Object.keys(interfaces), 'all'];

function runCommand(eName, message) {
  let words = _.words(message.contents.toLowerCase());
  if(!words.length || words[0] !== 'connection') return;

  // if(!words[1] || !words[2] || validTargets.indexOf(words[2]) === -1) {
  //   return message.respond('Usage: connection _cmd_ _interface_');
  // }

  switch(words[1]) {
    case 'reconnect':
      if(words[2] === 'all') {
        message.respond('Brb...')
        return connectionManager.reconnectAll().then(()=>message.respond('Back'));
      }else{
        message.respond('One sec...')
        return connectionManager.reconnect(words[2]).then(()=>message.respond('Back!'));
      }
    break;
    case 'status':
      let status = connectionManager.status();
      for (let v in status) {
        message.respond(`${v} is ${status[v]}`);
      }
    break;
    default:
      return message.respond('Invalid command');
    break;
  }


}

module.exports = {
  register: ()=>{
    bus.subscribe('message.direct', runCommand);
    return true;
  },
  help: ()=>{
    return {
      cmd: 'connection',
      description: 'manage connections',
      aliases: []
    };
  }
}
