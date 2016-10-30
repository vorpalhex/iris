const Discord = require('discord.js');
const discord = new Discord.Client();

const conf = require(__dirname + '/../util/conf').interfaces.discord;

module.exports = {
  connect: (cb)=>{
    discord.on('ready', ()=>{
      if(cb) return cb(null, true);
    });

    discord.login(conf.token).catch((err)=>{
      return cb(err, null);
    });
  },
  registerMsgHndlr: (hndl)=>{
    discord.on('message', (msg)=>{
      let message = {
        user: msg.author.username,
        contents: msg.content,
        raw: msg
      };
      hndl(message);
    });
  },
  disconnect: ()=>{
    return discord.destroy();
  }
}
