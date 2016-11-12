const core = require(__dirname + '/lib/core');

core.setup();
core.connect();

function exitHandler(){
  core.disconnect();
  process.exit();
}

//do something when app is closing
process.on('exit', exitHandler.bind(this));

//catches ctrl+c event
process.on('SIGINT', exitHandler.bind(this));

//catches uncaught exceptions
process.on('uncaughtException', exitHandler.bind(this));
