"use strict";
const _ = require('lodash'); //Lodash is our utility library, it does nice things for us

const bus = require(__dirname + '/../core/bus'); //our "bus" is where we get events from, like messages

//Here's a list of phrases we will respond to, and also say back
let phrases = [
  'greetings',
  'hi',
  'hello',
  'sup',
  'yo',
  'hey'
];

//Here's a list of phrases that we only listen to but never use for replies
let responds = [
  'what',
  'how',
  'hows',
];

responds = responds.concat(phrases);


//We use module.exports to make methods available to others
module.exports = {
  //our "register" function is called to setup our command
  register: ()=>{
    bus.subscribe('message.direct', activate); //we just want to activate on any direct messages
  },
  help: ()=>{
    return {
      cmd: 'hi',
      description: 'respond to greetings',
      aliases: ['hey', 'yo', 'sup', 'greetings']
    };
  }
}

//We get called with two parameters, our own name and the rest of the message
function activate(eName, message) {
  let words = _.words(message.contents); //lets break the message into words

  //if our first word is in our list of phrases...
  if(words.length > 0 && _.indexOf(responds, words[0].toLowerCase()) !== -1){
    message.respond(_.capitalize(_.sample(phrases)) + ' ' + message.user.displayName); //then say hi back
  }
}
