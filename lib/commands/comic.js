const glob = require('glob');
const path = require('path');
const _ = require('lodash');
const request = require('superagent');

const log = require(__dirname + '/../util/log')();

const previousMessagesToKeep = 10;
const previousMessages = [];
const assetDir = './../../assets/comics/';

const config = {
  assetBackgrounds: [],
  assetCharacters: [],
  borderColor: '#ffffff',
  font: 'fonts-tomsontalks'
};

//load blabber if we can, otherwise fail gracefully
let blabbercomic;

try {
  blabbercomic = require('blabber-comic');
} catch (error) {
  log.info('Blabber Comic could not be loaded', error);
}

//imgur upload
function uploadToImgur(image) {
  return request
  .post('https://api.imgur.com/3/image')
  .set('Authorization', 'Client-ID 38621c4b8e306d7')
  .type('form')
  .send({
    image,
    type: 'base64',
  });
}


function activate(message, preprocess) {
  let start = preprocess.words[0] || 3;
  let end = preprocess.words[1] || start;

  start = _.toNumber(start);
  end = _.toNumber(end);

  if(start > 20) start = 20;

  log.info('Generating comic...');
  message.reply('Give me a moment... drawing your comic...');

  message.channel.fetchMessages({limit: (start * 2), before: message.id})
  .then( (messageCollection) => {
    //We get back an unordered collection to start
    const orderedMessages = messageCollection.sort( (a, b) => a.createdTimestamp - b.createdTimestamp );
    //trim out any bots
    const nonBotMessages = orderedMessages.filter( (msg) => !msg.author.bot );

    const orderedText = nonBotMessages.map( (msg) => {
      return {user: msg.author.username, text: msg.cleanContent}
    });

    const trimmedMessages = orderedText.slice(nonBotMessages.length - start);

    return blabbercomic(trimmedMessages.slice(0, end), config);
  })
  .then((response) => {
    log.info('Comic generated, uploading to imgur...');
    return response.replace(/^data:image\/png;base64,/, '');
  })
  .then(uploadToImgur)
  .then((response) => {
    if (response.body.success) {
      log.info('Comic successfully uploaded to imgur @ ' + response.body.data.link);

      message.reply('Here ya go, ' + response.body.data.link);
    } else throw response.body.status;
  })
  .catch(error => {
    log.error(error, error.status)

    message.reply('Uh, hm, something kinda broke. Once more?');
  });
}

module.exports = {
  activate,
  register: () => {
    if (!blabbercomic) return false;

    //load backgrounds
    const backgroundsPath = path.join(__dirname, assetDir, 'backgrounds/');
    return glob(backgroundsPath + '*', (err, backgrounds)=>{
      if(err) {
        return log.error('Failed to load comic backgrounds', err);
      }
      config.assetBackgrounds = backgrounds;
      const charactersPath = path.join(__dirname, assetDir, 'characters/');
      return glob(charactersPath + '*', (err, characters)=>{
        if(err) {
          return log.error('Failed to load comic characters', err);
        }

        config.assetCharacters = characters;
        return true;
      });
    });
  },
  name: 'comic',
  description: 'generate a comic from the previous {x} messages, up to a limit',
  usage: 'comic [start] [count]'
};
