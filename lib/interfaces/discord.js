const Discord = require('discord.js');
const discord = new Discord.Client();
const async = require('async');
const _ = require('lodash');

const conf = require(__dirname + '/../util/conf').interfaces.discord;

const requiredir = require('require-dir');
const models = requiredir(__dirname + '/../models');

const bus = require(__dirname + '/../core/bus');

const interfaceName = 'discord';

function registerHandlers(){
  discord.on('presenceUpdate', (old, newP)=>{
    resolveUser(newP, (err, user)=>{
      pres = newP.presence;
      let presence = new models.Presence({
        interface: interfaceName,
        raw: pres,
        user: user,
        status: pres.status,
        substatus: pres.game
      });

      return bus.publish('presence', presence);
    });
  });

  discord.on('message', (msg)=>{
    resolveUser(msg.member, (err, user)=>{
      let message = {
        user: user,
        contents: msg.content,
        raw: msg,
        interface: interfaceName,
        respond: (content)=>{
          discord.rest.methods.sendMessage(msg.channel, content, {});
        },
        mentions: []
      };

      let mentions = message.contents.match(/\<\@[a-zA-Z0-9]{1,}\>/);

      async.each(mentions, (mention, cb)=> {
        let userId = mention.slice(2, -1);
        resolveUser(msg.mentions.users.get(userId), (err, usr)=>{
          if(err) return cb(err);
          message.contents = message.contents.replace(mention, '@'+usr.displayName);
          message.mentions[usr.displayName] = usr;
          return cb(null, message);
        });
      }, (err)=>{
        if(err) log.warn('Error handling message', err);
        if(message.contents.indexOf('@'+conf.name) === 0){
          let dm = _.clone(message);
          dm.contents = dm.contents.replace('@'+conf.name+' ', '');
          bus.publish('message.direct', dm);
        }
        return bus.publish('message', message);
      });
    });
  });
}

function resolveUser(member, cb){
  if(member.user) member = member.user;
  return cb(null, new models.User({
    raw: member,
    interface: interfaceName,
    interfaceId: member.id,
    email: member.email || '',
    displayName: member.username
  }));
}

module.exports = {
  connect: (cb)=>{
    discord.on('ready', ()=>{
      registerHandlers();
      if(cb) return cb(null, true);
    });

    discord.login(conf.token).catch((err)=>{
      return cb(err, null);
    });
  },
  resolveUser: resolveUser,
  disconnect: ()=>{
    return discord.destroy();
  }
}
