const fs = require('fs');

const _ = require('lodash'); //Lodash is our utility library, it does nice things for us
const moment = require('moment');
const bytes = require('bytes');

const bus = require(__dirname + '/../core/bus'); //our "bus" is where we get events from, like messages
const log = require(__dirname + '/../util/log')(); //our "bus" is where we get events from, like messages

const bootTime = moment(); //we really just need seconds here

//We use module.exports to make methods available to others
module.exports = {
  //our "register" function is called to setup our command
  register: ()=>{
    bus.subscribe('message.direct', activate); //we just want to activate on any direct messages
  }
}

//We get called with two parameters, our own name and the rest of the message
function activate(eName, message) {
  let cmdString = _.words(message.contents);
  let cmd = cmdString[0].toLowerCase();
  let logLines = cmdString[1];

  if(_.isNumber(logLines)){
    logLines = _.toInteger(logLines);
  } else {
    logLines = 3;
  }


  if(cmd !== 'status') return;

  let runTime = bootTime.toNow(true);
  let memUsage = process.memoryUsage();
  let cpuTime = process.cpuUsage();

  let logs = log.history.slice(0, logLines);

  message.respond(`I've been running for ${runTime}, during which time my log buffer has stored ${log.history.length} events.
  Currently my memory usage is ${bytes(memUsage.heapUsed)} out of ${bytes(memUsage.rss)},
  and my cpu time is around ${Math.round(cpuTime.user / 1000)}ms. The last ${logLines} lines of my logs buffer are: ${JSON.stringify(logs, null, 4)}`);
}
