'use strict';
const bus = require(__dirname + '/../core/bus');
const log = require(__dirname + '/../util/log')();
let conf = null;

try {
  conf = require(__dirname + '/../util/conf').commands.minecraft;
} catch (e) {
  console.log('Unable to load minecraft config', e);
}

const rcon = require('modern-rcon');

const whitelistPlayer = (player) => {
  const session = new rcon(conf.host, conf.port, conf.password, 5000);
  return session.connect()
  .then( () => session.send(`/whitelist add ${player}`) )
  .then( (res) => {
    if(!res || res.indexOf('Added') === -1) throw new Error(res);
  })
  .then( () => session.disconnect() )
  .catch( (e) => {
    session.disconnect();
    throw e;
  });
};

module.exports = {
  register: ()=>{
    return false; //this command is broken and will be fixed once I have fucks to give

    bus.subscribe('message.direct', (eName, message) => {
      let words = message.contents.toLowerCase().split(' ');
      if(!words[0] || words[0] !== 'minecraft') return;

      switch(words[1]) {
        case 'add':
        case 'whitelist':
          log.info(`Asked to whitelist ${words[2]} by ${message.user.displayName}`);
          return whitelistPlayer(words[2])
          .then( () => {
            log.info(`Whitelisted ${words[2]}`);
            return message.respond(`Whitelisted ${words[2]}!`);
          })
          .catch( (e) => {
            log.error('Error whitelisting player', words, e);
            return message.respond(`Oops, something went wrong. Uh, ask an admin? :blush:`);
          });

          break;
        case 'help':
          return message.respond('To add someone to the server, use `@iris minecraft add <minecraft username>`');
          break;
        default:
          return message.respond('Valid commands: add, help');
          break;
      }
    });
    return true;
  },
  name: 'minecraft',
  description: 'interact with the minecraft server',
  aliases: []
}
