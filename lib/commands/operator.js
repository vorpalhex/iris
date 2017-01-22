'use strict';
const _ = require('lodash'); //Lodash is our utility library, it does nice things for us
const bus = require(__dirname + '/../core/bus'); //our "bus" is where we get events from, like messages
const log = require(__dirname + '/../util/log')(); //our "bus" is where we get events from, like messages

const operators = require(__dirname + '/../storage/durable')('operators');
const Operator = require(__dirname + '/../models/Operator');

const interfaces = require(__dirname + '/../interfaces');

//We use module.exports to make methods available to others
module.exports = {
  //our "register" function is called to setup our command
  register: ()=>{
    bus.subscribe('presence', presenceAction);
    bus.subscribe('message.direct', messageAction);
    return true;
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
    case "register":
    case "add":
      let addOp = (targetUser)=>{
        let newOp = addOperator(targetUser);
        if(newOp) {
          return message.respond(`Registered ${newOp.name}`);
        } else {
          return message.respond(`Hmm, I wasn't able to do that. I think you may already be registered.`);
        }
      }

      if(!words[2]) return addOp(message.user);
      let target = message.mentions[words[2]];
      if(!target) return message.respond(`Uhm, I couldn't figure out what you mean by ${words[2]}`);
      return addOp(target);

      break;
    case "rm":
      return message.respond(`Um, uh, that's not a thing yet. Go fuck off.`);
      break;
    default:
      return message.respond(`You missed a word there. Maybe give that one a go again?`);
  }
}

function getOperator(user) {
  let ops = [];
  operators.where((op)=>{
    for(let i = 0; i < op.profiles.length; i++) {
      let profile = op.profiles[i];
      if(profile.id === user.id || profile.email === user.email) {
        ops.push(op);
        return;
      }
    }

    return;
  });

  if(ops.length) return ops[0];
  return false;
}

function addOperator(targetUser) {
  if(getOperator(targetUser)){
    log.info('Asked to add existing operator', targetUser.displayName);
    return false;
  }

  let op = new Operator({
    email: targetUser.email,
    name: targetUser.displayName,
    profiles: [targetUser]
  });
  operators.insert(op);
  op.save();

  log.info('Added New Operator', op.name);
  return op;
}

function upsertOperator(targetUser) {
  let op = getOperator(targetUser);
  if(op){
    return updateOperator(targetUser);
  } else {
    return addOperator(targetUser);
  }
}

function updateOperator(targetUser) {
  let op = getOperator(targetUser);
  if(!op) return false;

  op.profiles.forEach((profile)=>{
    if(profile._id === targetUser._id || profile.email === targetUser.email) {
      Object.assign(profile, targetUser);
      return op;
    }
  });
  //otherwise, no profile, create a new one
  op.profiles.push(targetUser);
  return op;
}

//We get called with two parameters, our own name and the rest of the message
function presenceAction(eName, presence) {
  let user = presence.user;
  updateOperator(user);
}
