"use strict";
const _ = require('lodash'); //Lodash is our utility library, it does nice things for us
const bus = require(__dirname + '/../core/bus'); //our "bus" is where we get events from, like messages
const log = require(__dirname + '/../util/log')(); //our "bus" is where we get events from, like messages

const operators = require(__dirname + '/../storage/durable')('operators');
const Operator = require(__dirname + '/../models/Operator');

//We use module.exports to make methods available to others
module.exports = {
  //our "register" function is called to setup our command
  register: ()=>{
    bus.subscribe('presence', presenceAction);
    bus.subscribe('message.direct', messageAction);
  },
  help: ()=>{
    return {
      cmd: 'operator',
      description: 'manage system operators'
    };
  }
};

function messageAction(eName, message) {
  let words = _.words(message.contents.toLowerCase());
  if(!words[0] || words[0] !== 'ops') return;

  switch(words[1]) {
    case "list":
    case "ls":
      let ops = operators.find({});
      ops = ops.map((op)=>{
        return op.name;
      });
      ops = ops.join('\n');
      return message.respond('```\n'+ops+'\n```');
      break;
    case "add":
      return message.respond(`Yolo bitches`);
      break;
    case "rm":
      return message.respond(`Um, uh, that's not a thing yet. Go fuck off.`);
      break;
    default:
      return message.respond(`You missed a word there. Maybe give that one a go again?`);
  }
}

//We get called with two parameters, our own name and the rest of the message
function presenceAction(eName, presence) {
  //see if we can find the underlying user
  let user = presence.user;

  let ops = operators.where((op)=>{
    op.profiles.forEach((profile)=>{
      if(profile._id === presence.user._id) {
        return op;
      }
    });
    return false;
  });

  if(ops.length) return;

  //otherwise, see if we can find a similar user
  //see if we can find the underlying user
  let similiar = operators.where((op)=>{
    op.profiles.forEach((profile)=>{
      if(profile.email === presence.user.email) {
        return op;
      }
    });
    return false;
  });

  if(similiar.length === 1){
    //update in place
    let op = similiar[0];
    similiar.profiles.push(user);
    operators.update(similiar);
    log.info('Updated Operator', similiar.id);
  } else {
    //create a new one
    let op = new Operator({
      email: user.email,
      name: user.displayName,
      profiles: [user]
    });
    log.info('Added New Operator', op.name);
  }
}
