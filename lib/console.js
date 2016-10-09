"use strict";

const clc = require('cli-color');

(function() {
	var error = clc.xterm(196);
	var warn = clc.xterm(214);
	var notice = clc.xterm(46);
	var debug = clc.green;
	var web = clc.xterm(38);

	var oldConsoleLog = console.log;
	var oldConsoleError = console.error;
	var oldConsoleWarn = console.warn;

  /* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
   * Classic Log
   *
   *
   *
   */

	console.error = function() {
		var now = new Date;
		for(var a in arguments) {
			var ar = arguments[a];
			arguments[a] = error(now.toLocaleString()+" [ERROR] "+ar);
		}
		oldConsoleError.apply(this, arguments);
	}

	console.warn = function() {
		var now = new Date;
		for(var a in arguments) {
			var ar = arguments[a];
			arguments[a] = warn(now.toLocaleString()+" [WARN] "+ar);
		}
		oldConsoleWarn.apply(this, arguments);
	}

	console.notice = function() {
		var now = new Date;
		for(var a in arguments) {
			var ar = arguments[a];
			arguments[a] = warn(now.toLocaleString()+" [NOTICE] "+ar);
		}
		oldConsoleLog.apply(this, arguments);
	}

	console.debug = function() {
		var now = new Date;
		for(var a in arguments) {
			var ar = arguments[a];
			arguments[a] = debug(now.toLocaleString()+" [DEBUG] "+ar);
		}
		oldConsoleLog.apply(this, arguments);
	}

  /* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
   * Web Log
   *
   *
   *
   */
	console.webNotice = function(req, msg) {
		var now = new Date;
		var ip = req.connection.remoteAddress;
		var line = now.toLocaleString()+" [WEB_NOTICE] "+
			ip+' '+
			msg
		;
		console.log(notice(line));
	}

	console.webError = function(req, msg) {
		var now = new Date;
		var ip = req.connection.remoteAddress;
		var line = now.toLocaleString()+" [WEB ERROR] "+
			ip+' '+
			msg
		;
		console.log(error(line));
	}

	console.web = function(req, res, next) {
		var now = new Date;
		var ip = req.connection.remoteAddress;
		var user = req.headers['user-agent'];
		user = user ? user : 'N/A';

		if(req.headers['x-real-ip'])
			ip += ' (Real: '+req.headers['x-real-ip']+')';

		res.on('finish', function() {
			var line = web(now.toLocaleString()+" [WEB] "+
				ip+' '+
				req.method+' '+
				res.statusCode+' '+
				req.url
			);

			oldConsoleLog.apply(this, [line]);
		})
		next();
	}

  /* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
   * Web Socket Log
   *
   *
   *
   */
  function formatWsArgument(ws) {
    if(!ws.msg)
      return('');
    var r = ' '+ws.cmd;
    for(var a in ws.msg) {
      var p = ws.msg[a];

      function append(text) {
        if(r.length == 0)
          r += ' with';
        r += ' '+text;
      }

      if(typeof p === 'string')
        append(a+'='+p)
      if(typeof p === 'number')
        append(a+'='+p)
    }
    return(r);
  }

	console.wsNotice = function(ws, msg, json) {
		var line = '[WS] '+ws.address+' '+
			msg;
    if(json)
      line += formatWsArgument(json);
		console.notice(line);
	}

	console.wsError = function(ws, msg, json) {
		var line = '[WS] '+ws.address+' '+
			msg;
    if(json)
      line += formatWsArgument(json);
		console.error(line);
	}

  console.wsDebug = function(ws, msg, json) {
    /* hack here because lookalert gens to many logs */
    if(json && json.cmd == "lookAlert")
      return
		var line = '[WS] '+ws.address+' '+
			msg;
    if(json)
      line += formatWsArgument(json);
		console.debug(line);
	}

})();
