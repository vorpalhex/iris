"use strict";
const winston = require('winston');
const conf = require(__dirname + '/conf');

let logger = new winston.Logger({
  level: 'info',
  transports: [
    new (winston.transports.Console)({
      colorize: true
    }),
    new (winston.transports.File)({
      filename: __dirname + '/../../log/botface.log',
      maxSize: 10485760, //10 megs
      maxFiles: 2
    })
  ]
});

logger.history = [];

logger.on('logging', function (transport, level, msg, meta) {
  // [msg] and [meta] have now been logged at [level] to [transport]
  if(level === 'warn' || level === 'error'){
    logger.history.unshift({msg, meta});
    if(logger.history.length > 50){
      logger.history.pop();
    }
  }
});

module.exports = function() {
  return logger;
}
