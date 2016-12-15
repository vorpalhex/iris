'use strict';
const fs = require('fs');
const os = require('os');
const shell = require('child_process').execSync;

const _ = require('lodash'); //Lodash is our utility library, it does nice things for us
const moment = require('moment');
const bytes = require('bytes');
const username = require('username').sync();

const bus = require(__dirname + '/../core/bus'); //our "bus" is where we get events from, like messages
const log = require(__dirname + '/../util/log')(); //our "bus" is where we get events from, like messages

const bootTime = moment(); //we really just need seconds here
const version = shell('git rev-parse HEAD', {encoding: 'utf8'}).replace('\n', '');

//We use module.exports to make methods available to others
module.exports = {
  //our "register" function is called to setup our command
  register: ()=>{
    bus.subscribe('message.direct', activate); //we just want to activate on any direct messages
  },
  help: ()=>{
    return {
      cmd: 'status',
      description: 'returns a status object including runtime',
      aliases: []
    };
  }
}

//We get called with two parameters, our own name and the rest of the message
function activate(eName, message) {
  let cmdString = _.words(message.contents, /[^, ]+/g);
  if(!cmdString.length) return;
  let cmd = cmdString[0].toLowerCase();
  let logLines = _.toInteger(cmdString[1]);

  if(cmd !== 'status') return;

  let runTime = bootTime.toNow(true);
  let memUsage = process.memoryUsage();
  let cpuTime = process.cpuUsage();

  let logs = log.history.slice(0, logLines);

  let response = `I've been running for ${runTime}, during which time my log buffer has stored ${log.history.length} events.
My current git hash is ${version}.
Currently my memory usage is ${bytes(memUsage.rss)}.
I'm running under the user ${username} on ${os.hostname()}.`

if(logLines){
  response +=`
The last ${logLines} lines of my logs buffer are: ${JSON.stringify(logs, null, 4)}`;
}

  message.respond(response);
}
