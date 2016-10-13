const fs = require('fs');
const net = require('net');
const url = require('url');
const cluster = require('cluster');
const utils = require(__dirname+'/utils.js');
const cmParser = require(__dirname+'/parser.js');
const jen = new (require("node-jen"))();

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 *
 * Router incomming communication
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
var cmRouterComm = function(cm, socket) {
	var self = this;
	this.cm = cm;
	this.socket = socket;
	this.id = jen.password(20);
	this.parser = new cmParser(cm);

	cm.revent.emit('rOpen', self);

	var hello = this.parser.encode({some: 'meta'}, new Buffer("The datacidsicjids cjid s"));

	socket.on('close', function(e) {
		console.error('CMIG Router socket error: '+e.message);
	});

	socket.on('data', function(d) {
		console.log(d);
	});

	socket.on('close', function() {
		console.log('client disconnect');
		cm.revent.emit('rClose', self);
	})
}

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 *
 * Router service
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
var cmRouter = function(cm) {
	this.cm = cm;
};

cmRouter.prototype.bind = function(connStr) {
	var self = this;
	this.comms = [];

	/* parse url */
	try {
		var burl = url.parse(connStr);
	} catch(e) {
		console.error('Cannot binding CMIG Router: '+e.message);
		return(false);
	}

	/* create generic server */
	this.server = net.Server();

	/* handle connection */
	this.server.on('connection', function(socket) {
		var s = new cmRouterComm(self.cm, socket);

		self.comms.push(s);
	});

	/* * * * * * * * * * * * * * * * * * * * * * * * * * *
	 * AF_UNIX */
	if(burl.protocol == 'unix:') {
		this.server.protocol = 'unix';
		var socketFile = burl.pathname;

		utils.mkdirDeep(socketFile);
		try {
			fs.unlinkSync(socketFile);
		} catch(e) {}

		this.server.on('error', function(e) {
			console.error('Cannot binding CMIG Router: '+e.message);
		});
		this.server.listen(socketFile, function() {
				console.debug('Binding CMIG Router at UNIX socket: '+burl.pathname);
		});
		return(true);
	}

	/* * * * * * * * * * * * * * * * * * * * * * * * * * *
	 * TCP */
	 if(burl.protocol == 'tcp:') {
	 	this.server.protocol = 'tcp';

		this.server.on('error', function(e) {
			if(e.code == 'EADDRINUSE') {
				console.warn('Error binding CMIG Router: Address in use, retrying...');
				setTimeout(() => {
					self.server.close();
					self.server.listen(PORT, HOST);
				}, 1000);
			}
			else
 				console.error('Error binding CMIG Router: '+e.message);
 		});
 		this.server.listen(burl.port, burl.hostname, function() {
 				console.debug('Binding CMIG Router at TCP IPv4 socket: '+burl.host);
 		});
 		return(true);
 	}

	console.error('Cannot bind CMIG Router: Unknown protocol '+connStr);
	return(false);
}


module.exports = cmRouter;
