'use strict';
const Discord = require('discord.js');
const discord = new Discord.Client();

const log = require('../util/log')();
const conf = require(__dirname + '/../util/conf').discord;
const bus = require(__dirname + '/../core/bus');

function registerHandlers(){
  log.info('Starting the registration process');

  discord.on('presenceUpdate', (oldMember, newMember) => bus.publish('presence', {oldMember, newMember} ));

  discord.on('message', (msg)=>{
    if (msg.author.bot) return; //ignore other bots
    if (msg.author.id === discord.user.id) return; //never read our own messages (even though we are a bot, probably)
    if (msg.isMentioned(discord.user)) return bus.publish('message.direct', msg);
    if (msg.channel instanceof Discord.DMChannel) return bus.publish('message.direct', msg); //direct message
    return bus.publish('message', msg);
  });
}

module.exports = {
  connect: ()=>{
    discord.once('ready', ()=>registerHandlers());
    discord.on('error', (err)=>log.error(err));

    return discord.login(conf.token)
  },
  reconnect: ()=>{
    return discord.login(conf.token)
  },
  disconnect: ()=>{
    discord.destroy();
  },
  client: discord
};
