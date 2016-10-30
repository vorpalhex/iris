const slack = require('slack');
const conf = require(__dirname + '/../util/conf').interfaces.slack;

let bot = slack.rtm.client();

module.exports = {
  connect: (cb)=>{
    bot.started((payload)=>{
      if(cb) return cb(null, payload);
    });

    bot.listen({
      token: conf.token,
    });

  },
  disconnect: ()=>{
    bot.close();
  }
}
