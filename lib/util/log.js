const winston = require('winston');
const conf = require(__dirname + '/conf');

module.exports = function() {
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

  return logger;
}
