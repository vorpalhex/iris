const http = require('http');
const shell = require('child_process').execSync;

const createHandler = require('github-webhook-handler');

const log = require(__dirname + '/../util/log')();
const conf = require(__dirname + '/../util/conf').updater;

const branch = conf.branch || 'master';

const handler = createHandler({ path: '/webhook', secret: conf.secret || 'none' });

handler.on('error', (err)=>{
  log.warn('webhook error', err);
});

handler.on('push', (event)=>{
  if(event.payload.ref !== 'refs/heads/'+branch) return;

  conf.commands.forEach((cmd)=>{
    shell(cmd);
  });
});

module.exports = {
  setup: function(){
    http.createServer((req, res)=>{
      handler(req, res, (err)=>{
        res.statusCode = 404;
        res.end('no such location');
      });
    }).listen(conf.port);
  }
};
