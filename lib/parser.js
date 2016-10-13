const fs = require('fs');
const net = require('net');
const url = require('url');
const cluster = require('cluster');
const utils = require(__dirname+'/utils.js');
const jen = new (require("node-jen"))();

var cmParser = function(cm) {
	this.cm = cm;
};

cmParser.prototype.encode = function(meta, data) {
	var dmeta = {
		id: jen.password(10),
		question: false,
		reply: false,
	};

	var bin = Buffer.isBuffer(data) ? data : new Buffer(data);


	console.log(bin.length);

}

cmParser.prototype.decode = function(buffer) {

}

module.exports = cmParser;
