const _ = require('lodash');
const request = require('superagent');
const wtf = require('wtf_wikipedia');

const bus = require(__dirname + '/../core/bus');
const log = require(__dirname + '/../util/log')();

function runCommand(eName, message) {
  let words = _.words(message.contents);
  if(!words.length || words[0].toLowerCase() !== 'wiki') return;

  let query = words.slice(1).join(' ');
  if(query.length < 1) {
    return message.respond(`Uhhh, I think you failed at Wikipedia there ${message.user.displayName}.`);
  }

  function handleError(){
    message.respond(`Oh dear, I'm sorry ${message.user.displayName} but I can't seem to find ${query}...`);
    return log.info('Wikipedia Issue (probably a bad lookup)', query);
  }

  //wtf-wikipedia is both the best of the wikipedia clients, and the worst of all the NPM modules
  try {
    wtf.from_api(query, 'en', (markup)=>{
      if(!markup || markup.length < 10) return handleError();
      let text = wtf.plaintext(markup);
      if(!text || text.length < 10) return handleError();
      let boundary = text.indexOf('\n');
      if(boundary > 500) boundary = 500;

      message.respond(`
  ${query}
  ---
  ${_.truncate(text, { length: boundary })}
  ---
  https://en.wikipedia.org/wiki/${_.snakeCase(query)}
  `);
    });
  } catch (e) {
    message.respond(`Oh dear, I'm sorry ${message.user.displayName} but I can't seem to find ${query}...`);
    return log.info('Wikipedia Issue (probably a bad lookup)', query, e);
  }


}

module.exports = {
  register: ()=>{
    bus.subscribe('message.direct', runCommand);
  }
}
