const fs = require('fs');
const net = require('net');
const url = require('url');
const cluster = require('cluster');
const utils = require(__dirname+'/utils.js');
const jen = new (require("node-jen"))();

var cmParser = function(cm, rcomm) {
	this.cm = cm;
};

module.exports = cmParser;
