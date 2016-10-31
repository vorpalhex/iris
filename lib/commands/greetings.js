const _ = require('lodash');

const bus = require(__dirname + '/../core/bus');

let phrases = [
  'hi',
  'hello',
  'sup',
  'yo',
  'hey'
];

module.exports = {
  register: ()=>{
    bus.subscribe('message.direct', activate);
  }
}

function activate(eName, message) {
  let words = _.words(message.contents);
  
  if(_.indexOf(phrases, words[0].toLowerCase()) !== -1){
    message.respond(_.sample(phrases) + ' ' + message.user.displayName);
  }
}
