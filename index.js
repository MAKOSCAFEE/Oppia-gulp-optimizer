'use strict';

var through = require('through2');
var path = require('path');
var gutil = require('gulp-util');
var spawn = require('child_process').spawn;

var PluginError = gutil.PluginError;
var File = gutil.File;
var defaultStartAction = 'dev_appserver.py';

module.exports = function(action, args, params) {
  action = action || 'dev_appserver.py';
  args = args || [];
  params = params || {};

  var proc;

  if (['dev_appserver.py', 'appcfg.py'].indexOf(action) == -1) {
    throw new PluginError('oppia-gulp', 'Invalid action ' + action +
      '. Supported actions are dev_appserver.py and appcfg.py');
  }

  var parseParams = function(params) {
    var p = [];
    for (var key in params) {
      var value = params[key];
      if (value === undefined) {
        // Value-less parameters.
        p.push('--' + key);
      } else {
        p.push('--' + key + '=' + value);
      }
    }

    return p;
  };

  var runScript = function(file, args, params, cb) {
    var scriptArgs = args.concat(parseParams(params));
    gutil.log('[gulp-gae]', scriptArgs);
    proc = spawn(file, scriptArgs);
    proc.stdout.pipe(process.stdout);
    proc.stderr.pipe(process.stderr);
    cb && cb();
  };

  var stopScript = function() {
    gutil.log('[oppia-gulp]', 'stopping script');
    proc && proc.kill('SIGHUP');
    proc = null;
  };

  var bufferContents = function(file, enc, cb) {
    var appYamlPath = path.dirname(file.path);
    var shouldWait = false;

    if (action == 'dev_appserver.py') {
      args = [appYamlPath].concat(args);
    } else if (action == 'appcfg.py') {
      args = args.concat([appYamlPath]);
      shouldWait = true;
    }

    runScript(action, args, params, cb);

    process.on('SIGINT', stopScript);
    process.on('exit', stopScript);
  };

  var endStream = function(cb) {
    cb();
    return;
  };

  return through.obj(bufferContents, endStream);
};
