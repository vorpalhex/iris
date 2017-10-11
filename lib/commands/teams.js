'use strict';
const _      = require('lodash');

function teamSplit(query, message) {
  if (query.length < 2) {
    return message.reply(`Please re-enter command: teams "{names}" "{teams}"`);
  } else if (query[1].length >= 1 && query[0].length >= 1) {
    return message.reply(`Not enough names or teams. Please re-enter command: teams "{names}" "{teams}"`);
  }
  message.reply(`Creating teams...`);
  let names = query[0].replace(/"/g,"").replace(/ /g,"").split(',');
  let teamNames = query[1].replace(/"/g,"").replace(/ /g,"").split(',');

  // Randomizing lists
  let randomNames = _.shuffle(names);
  let randomTeams = _.shuffle(teamNames);

  const teamOutput = {};
  teamNames.forEach( (name) => {
    teamOutput[name] = [];
  });

  for (let i=0;i<randomNames.length;i++) {
    teamOutput[randomTeams[i%randomTeams.length]].push(randomNames[i]);
  }

  Object.keys(teamOutput).forEach(key => {
    let teamAssignment = teamOutput[key].join(', ');
    message.reply(`Team ${key}: ${teamAssignment}`);
  });
}

function activate(message, preprocess) {
  const query = preprocess.remainder.match(/"([^"]*)"/g);

  return teamSplit(query, message);
}

// All abord teh bus, bus!
module.exports = {
  activate,
  name: 'teams',
  description: 'assign a group of users to teams',
  aliases: ['team'],
  usage: 'teams "{users}" "{teams}"'
};
