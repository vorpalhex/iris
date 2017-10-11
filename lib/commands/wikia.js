'use strict';
const _      = require('lodash');
const log    = require(__dirname + '/../util/log')();
const csplit = require(__dirname + '/../util/commandSplit');

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
    return message.reply(`${res.body.items[0].title} - ${res.body.items[0].url}`);
  })
  .catch((err)=>{
    if (err.status >= 400 && err.status < 500) {
      return message.reply(`Wikia ${domain} not found or no search result found`);
    }

    return log.error(err, err.status);
  });
}

function activate(message, preprocess) {
  const domainLength = preprocess.words[0].length + 1;
  const query = preprocess.remainder.slice(domainLength)
  return findWikia(preprocess.words[0], query, message);
}

// All abord teh bus
module.exports = {
  activate,
  name: 'wikia',
  description: 'look up a topic in a wikia',
  aliases: [],
  usage: 'wikia "{wiki}" {query}'
};
