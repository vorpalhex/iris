const glob = require('glob');
const path = require('path');
const _ = require('lodash');
const request = require('superagent');

const bus = require(__dirname + '/../core/bus');
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
}
catch (error) {
  log.info('Blabber Comic could not be loaded', error);
}

//preserve message history
function savePreviousMessages(eName, message) {
  let [ command ] = _.words(message.contents.toLowerCase());
  let user = message.user.displayName;
  let text = message.contents;

  if (message.contents.length && command !== 'comic') {
    if(!previousMessages[message.channel]) previousMessages[message.channel] = [];
    previousMessages[message.channel] = _.takeRight(previousMessages[message.channel].concat([{user, text}]), previousMessagesToKeep);
  }
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


function runCommand(eName, message) {
  let [ command, requestedLineNumber ] = _.words(message.contents);
  if (command !== 'comic') return;

  if (!requestedLineNumber) requestedLineNumber = 3;

  requestedLineNumber = _.toNumber(requestedLineNumber);
  if(!previousMessages[message.channel] || previousMessages[message.channel].length < requestedLineNumber) {
    return message.respond(`Uh, hm? Oh, sorry, I wasn't paying attention.`);
  }

  log.info('Generating comic...');
  message.respond('Give me a moment... drawing your comic...');

  let comicText = previousMessages[message.channel].slice(0 - requestedLineNumber);

  return blabbercomic(comicText, config)
  .then((response) => {
    log.info('Comic generated, uploading to imgur...');
    return response.replace(/^data:image\/png;base64,/, '');
  })
  .then(uploadToImgur)
  .then((response) => {
    if (response.body.success) {
      log.info('Comic successfully uploaded to imgur @ ' + response.body.data.link);

      message.respond('Here ya go, ' + response.body.data.link);
    } else throw response.body.status;
  })
  .catch(error => log.error(error, error.status));
}

module.exports = {
  register: () => {
    if (!blabbercomic) return;

    //load backgrounds
    const backgroundsPath = path.join(__dirname, assetDir, 'backgrounds/');
    glob(backgroundsPath + '*', (err, backgrounds)=>{
      if(err) {
        return log.error('Failed to load comic backgrounds', err);
      }
      config.assetBackgrounds = backgrounds;
      const charactersPath = path.join(__dirname, assetDir, 'characters/');
      glob(charactersPath + '*', (err, characters)=>{
        if(err) {
          return log.error('Failed to load comic characters', err);
        }
        config.assetCharacters = characters;

        bus.subscribe('message', savePreviousMessages);
        bus.subscribe('message.direct', runCommand);
      });
    });

  },
  help: () => {
    if(!blabbercomic) return false;

    return {
      cmd: 'comic',
      description: 'generate a comic from the previous {x} messages',
      usage: 'comic 5'
    };
  }
}
