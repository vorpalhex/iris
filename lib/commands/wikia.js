const _      = require('lodash');
const bus    = require(__dirname + '/../core/bus');
const log    = require(__dirname + '/../util/log')();
const csplit = require(__dirname + '/../util/commandSplit')();

const request = require('superagent');

function findWikia(domain, search, message) {
  let wikia = 'http://www.wikia.com/api/v1/Wikis/ByString/?limit=1&string=' + domain;

  request
  .get(wikia)
  .set('Accept', 'application/json')
  .then((res)=>{
    return res.body.items[0].domain;
  })
  .then((newDomain)=>{
    let wikiaDomain = 'http://' + newDomain + '/api/v1/Search/List?limit=1&query=' + search;
    return request.get(wikiaDomain).set('Accept', 'application/json');
  })
  .then((res)=>{
    return message.respond(`${res.body.items[0].title} - ${res.body.items[0].url}`);
  })
  .catch((err)=>{
    if (err.status >= 400 && err.status < 500) {
      return message.respond(`Wikia ${domain} not found or no search result found`);
    }

    return log.error(err, err.status);
  });
}

function stringify(text) {
  return text.replace(' ', '+');
}

function wikiaCommandMatch(word) {
  return word && word.toLowerCase() === 'wikia';
}

function runCommand(eName, message) {
  let command = csplit(message.contents);

  if (wikiaCommandMatch(command[0])) {
    findWikia(stringify(command[1]), stringify(command[2]), message);
  }
}

// All abord teh bus
module.exports = {
  register: ()=>{
    bus.subscribe('message.direct', runCommand);
  },
  help: ()=>{
    return {
      cmd: 'wikia',
      description: 'look up a topic in an alias',
      aliases: [],
      usage: 'wikia "{wiki}" {query}'
    };
  }
};
