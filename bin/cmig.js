
const EventEmitter = require('events');
const fs = require('fs');
const program = require('commander');
const cluster = require('cluster');
const cmRouter = require(__dirname+'/../lib/router.js');

require(__dirname+'/../lib/console.js');

function list(val) {
  return val.split(',');
}


program
  .option('-n, --name [hostname]', 'Set node hostname, default local hostname')
  .option('-r, --routers [routers]', 'Connect to the list of CMIG Routers', list, [])
  .option('--runDir [runDir]', 'Running directory, default /tmp/cmig', '/tmp/cmig')
  .option('--rbind [rbind]', 'List of Routers to bind, default tcp4://127.0.0.1:3245', list, ['tcp4://127.0.0.1:3245'])
  .option('-v, --verbose')
  .parse(process.argv);

new (function(args) {
  var self = this;
  this.program = args;

  if(cluster.isMaster) {
    process.title = 'CMIG Router';

    this.routers = [];

    /* router events */
    this.revent = new EventEmitter;

    console.log(this);

    /* create local router */
    var r = new cmRouter(this);
    r.bind('unix://'+this.program.runDir+'/'+'master');
    this.routers.push(r);

    /* run other cmig router */
    for(var a in this.program.rbind) {
      var p = this.program.rbind[a];
      var r = new cmRouter(self);
      if(r.bind(p))
        self.routers.push(r);
    }

  }
  else {


  }

})(program);
