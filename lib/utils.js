var path = require('path');
var fs = require('fs');

var utils = function() {};

String.prototype.safePath = function() {
	var s = this.toString().split("/"), r = [];
	for(var a in s) {
		if(s[a] != "..")
			r.push(s[a]);
	}
	r = r.join("/");
	var i = r.indexOf("\0");
	if(i > 0)
		r = r.substr(0, i);
	return(r);
};

utils.strReverse = function(str) {
	return(str.split('').reverse().join(''));
};


utils.lib = function(name) {
	var f;
	try {
		f = gui.__dirname + '/lib/' + name;
		return(require(f.safePath()));
	}
	catch(e) {}

	return(null);
};


/* Avoid directory traversal. If it traverse, returns "/" or "/." */
utils.cleanPath = function(f) {
	/* On later versions of node, path.posix is available. Better for portability, since windows does not use '/' */
	f = path.relative('/', path.join('/', f));

	return('/' + f);
};

utils.mkdirDeep = function(dir) {
	var stage = '';
	var tab = dir.split("/");
	tab.pop();

	for(var a = 1; a<tab.length; a++) {
		stage += '/'+tab[a];
		try  {
			try {
				var fss = fs.statSync(stage);
			} catch(a) {
				fs.mkdirSync(stage);
			}
		}
		catch(e) {
			console.error('* Error: can not create '+dir);
			process.exit(0);
		}
	}
	return(true);
};


module.exports = utils;
