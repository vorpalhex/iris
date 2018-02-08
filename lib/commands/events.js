'use strict';

//modules
const cron = require('node-cron');
const chrono = require('chrono-node');
const moment = require('moment');
const gAuth = new (require('google-auth-library'))();
const cal = (require('googleapis')).calendar('v3');

const discord = require('../core/discord');

//local
const bus = require(__dirname + '/../core/bus');
const log = require(__dirname + '/../util/log')();
const csplit = require(__dirname + '/../util/commandSplit');
let conf = null;

try {
  conf = require(__dirname + '/../util/conf').commands.events;
} catch (e) {
  console.log('Unable to load events config', e);
}

process.env['GOOGLE_APPLICATION_CREDENTIALS'] = conf.secret;
const calendarId = conf.calendar;

//setup our cron
cron.schedule('0 9 * * *', listEvents);
//cron.schedule('* * * * *', listEvents);

function auth() {
  return new Promise((resolve, reject) => {
    gAuth.getApplicationDefault((err, authClient)=>{
      if(err) return reject(err);

      if (authClient.createScopedRequired && authClient.createScopedRequired()) {
        const scopes = [
          'https://www.googleapis.com/auth/calendar'
        ];
        authClient = authClient.createScoped(scopes);
      }

      return resolve(authClient);
    });
  });
}

function addEvent(name, start, end, location) {
  start = chrono.parseDate(start);

  if (end) {
    end = chrono.parseDate(end);
  } else {
    end = moment(start).add(2, 'hours')
  }


  return auth()
  .then((auth) => {
    return new Promise( (resolve, reject) => {
      const resource = {
        start: {
          dateTime: start,
        },
        end: {
          dateTime: end,
        },
        summary: name,
        location
      };

      cal.events.insert({
        auth,
        calendarId,
        resource,
      }, (err, event) => {
        if (err) return reject(err);

        return resolve(event);
      });
    });
  });
}

function listEvents(message) {
  let responder = null;
  if(message) {
    responder = message.reply.bind(message);
  } else {
    let eventChannel = discord.client.channels.find('name', 'austin-events');
    responder = eventChannel.send.bind(eventChannel);
  }

  getEvents(5)
  .then( (events) => {
    const lines = ["Here's what I've got on the schedule:", '', ''];

    if(!events.length) return responder('No events coming up!');

    events.forEach( (event) => {
      lines.push(`**${event.summary}** ${event.creator.email}`);
      lines.push(` ${moment(event.start.dateTime).calendar(null, {sameElse: 'MM/DD/YYYY h:mma'})} - ${moment(event.end.dateTime).calendar(null, {sameElse: 'DD/MM/YYYY h:mma'})}`);
      lines.push(`*${event.location || 'No location provided'}*`);
      lines.push('---');
      lines.push(event.description);
      lines.push('');
      lines.push(event.htmlLink);
      lines.push('');
      lines.push('');
      lines.push('');
    });

    const output = lines.join('\n');
    return responder(output);
  })
  .catch( (e) => {
    log.error('Error getting events', e);
    return responder('Errrr, hm. That did not quite work. Try that again?');
  });
}

function getEvents(maxResults=5) {
  return new Promise( (resolve, reject) => {
    auth().then((auth) => {
      cal.events.list({
        auth,
        calendarId,
        maxResults,
        timeMin: (new Date).toISOString(),
        singleEvents: true,
        orderBy: 'startTime'
      }, (err, response) => {
        if (err) return reject(err);
        return resolve((response && response.items) || []);
      });
    })
  });
}

function activate(message, preprocess) {
  let words = csplit(preprocess.remainder.toLowerCase());

  switch(words[0]) {
    //events add "my event name" "start" "end" "location"
    case 'add':

      if(words.length < 3) return message.reply('events add "my event name" "tomorrow at 9pm" "tomorrow at 10pm" "Opals" ');

      const name = words[1];
      const start = words[2];
      const end = words[3] || null;
      const location = words[4] || null;

      addEvent(name, start, end, location)
        .then( () => message.reply('Event created!') )
        .catch( (e) => {
          log.error('Error creating event', words, e);
          return message.reply('Errrr, hm. That did not quite work. Try that again?');
        })

      break;
    case 'list':
      return listEvents(message);
      break;
    default:
      return message.reply('Valid commands: add, list');
      break;
  }
}

module.exports = {
  activate,
  name: 'events',
  description: 'add new events and announce upcoming ones',
  longDescription: '@iris events list | @iris events add <name> <start>',
  aliases: ['event']
}
