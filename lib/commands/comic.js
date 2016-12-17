const fs = require('fs');
const _ = require('lodash');
const request = require('superagent');
const blabbercomic = require('blabber-comic');
const bus = require(__dirname + '/../core/bus');
const log = require(__dirname + '/../util/log')();

function isImage(fileString) {
  let ext = fileString.slice(fileString.indexOf('.'));
  return ['.png', '.jpg'].indexOf(ext) > -1;
}

const previousMessagesToKeep = 10;
const borderColor = '#ffffff';
const font = 'fonts-tomsontalks';

const assetDir = './assets/comics/';
const assetBackgrounds = fs.readdirSync(assetDir + 'backgrounds')
.filter(isImage)
.map(path => assetDir + 'backgrounds/' + path);
const assetCharacters = fs.readdirSync(assetDir + 'characters')
.filter(isImage)
.map(path => assetDir + 'characters/' + path);

let previousMessages = [];
function savePreviousMessages(eName, message) {
  let [ command ] = _.words(message.contents.toLowerCase());
  let user = message.user.displayName;
  let text = message.contents;

  if (command && command !== 'comic') {
    previousMessages = _.takeRight(previousMessages.concat([{user, text}]), previousMessagesToKeep);
  }
}

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
  requestedLineNumber = parseInt(requestedLineNumber);
  if (command !== 'comic') return;
  if (!requestedLineNumber) {
    log.warn(`${message.user.name} tried to generate a comic without specifying # of lines`);
    message.respond(`Make a comic from what? ${message.user.displayName} tell me how many lines up I should use. \`comic 5\``);
    return;
  }

  message.respond('Give me a moment... drawing your comic...');

  let comicText = previousMessages.splice(0, requestedLineNumber);
  let config = { assetBackgrounds, assetCharacters, borderColor, font };

  log.info('Generating comic...');

  return blabbercomic(comicText, config)
  .then(response => {
    log.info('Comic generated, uploading to imgur...');
    return response.replace(/^data:image\/png;base64,/, '');
  })
  .then(uploadToImgur)
  .then(response => {
    if (response.body.success) {
      log.info('Comic successfully uploaded to imgur @ ' + response.body.data.link);

      message.respond('Here ya go, ' + response.body.data.link);
    } else throw response.body.status;
  })
  .catch(error => log.error(error, error.status));
}

module.exports = {
  register: () => {
    bus.subscribe('message', savePreviousMessages);
    bus.subscribe('message.direct', runCommand);
  },
  help: () => {
    return {
      cmd: 'comic',
      description: 'generate a comic from the previous {x} messages',
      usage: 'comic 5'
    };
  }
}
