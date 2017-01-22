'use strict';
const _ = require('lodash');
const request = require('superagent');

const bus = require(__dirname + '/../core/bus');
const log = require(__dirname + '/../util/log')();

function runCommand(eName, message) {
  let words = _.words(message.contents);
  if(!words.length || words[0].toLowerCase() !== 'connect') return;


}

module.exports = {
  register: ()=>{
    bus.subscribe('message.direct', runCommand);
    return true;
  },
  help: ()=>{
    return {
      cmd: 'connect',
      description: 'manage connections',
      aliases: []
    };
  }
}
