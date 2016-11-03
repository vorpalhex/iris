const slack = require('slack');
const _ = require('lodash');
const async = require('async');
const conf = require(__dirname + '/../util/conf').interfaces.slack;

const requiredir = require('require-dir');
const models = requiredir(__dirname + '/../models');

const bus = require(__dirname + '/../core/bus');
const log = require(__dirname + '/../util/log')();

const interfaceName = 'slack';

let bot = slack.rtm.client();

var resId = 1;

function resolveUser(userId, cb){
  slack.users.info({token: conf.token, user: userId}, (err, data)=>{
    if(err) return cb(err);
    let usr = data.user;
    let user = new models.User({
      raw: usr,
      displayName: usr.name,
      interface: interfaceName,
      interfaceId: usr.id,
      email: usr.profile.email
    });

    return cb(null, user);
  });
}

function sendMsg(content, channel){
  bot.ws.send(JSON.stringify({
    id: resId,
    type: 'message',
    channel: channel,
    text: content
  }));
  resId = resId++;
}

function registerHandlers(){
  //handle presence updates
  bot.presence_change((pres)=>{
    resolveUser(pres.user, (err, user)=>{
      if(err) return log.warn(err);
      let presence = new models.Presence({
        user: user,
        raw: pres,
        interface: interfaceName,
        status: pres.presence
      });

      return bus.publish('presence', presence);
    });
  });

  //handle messages
  bot.message((msg)=>{

    let message = new models.Message({
      user: msg.user,
      contents: msg.text,
      raw: msg,
      interface: interfaceName,
      mentions: {},
      respond: (content)=> {
        return sendMsg(content, msg.channel);
      }
    });

    //resolve user to user object
    //replace in-text mentions
    resolveUser(msg.user, (err, user) => {
      if(!err && user) {
        message.user = user;
      }

      if(message.user.displayName === conf.name || message.user.displayName === 'me') return;

      //replace all mentions
      message.contents = _.replace(message.contents, '<!here|@here>', '@here');
      let mentions = message.contents.match(/\<\@[a-zA-Z0-9]{1,}\>/);

      async.each(mentions, (mention, cb)=> {
        let userId = mention.slice(2, -1);
        resolveUser(userId, (err, usr)=>{
          if(err) return cb(err);
          message.contents = message.contents.replace(mention, '@'+usr.displayName);
          message.mentions[usr.displayName] = usr;
          return cb(null, message);
        });
      }, (err)=>{
        if(err) log.warn('Error handling message', err);
        if(message.contents.indexOf('@'+conf.name) === 0 || msg.channel[0].toLowerCase() === 'd'){
          let dm = _.cloneDeep(message);
          dm.contents = dm.contents.replace('@'+conf.name+' ', '');
          bus.publish('message.direct', dm);
        } else {
          return bus.publish('message', message);
        }
      });
    });
  });

}

module.exports = {
  connect: (cb)=>{
    bot.hello((payload)=>{
      registerHandlers();
      if(cb) return cb(null, payload);
    });

    bot.listen({
      token: conf.token,
    });
  },
  resolveUser: resolveUser,
  disconnect: ()=>{
    return bot.close();
  }
}
