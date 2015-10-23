var gulp = require('gulp');
// Finds index.js file
var gae = require('../');
var path = require('path');
// Argrments which will be passed in start.sh
var argv = require('yargs')
    .usage('Usage: $0 --pythoncmd [python command]' +
      '--appengine [Path to app engine]' +
      '--clear_datastore [clear all data storage]' +
      '--enable_sendmail [send emails]')
    .demand(['pythoncmd', 'appengine'])
    .argv;
var serveCmd = argv.pythoncmd + ' ' + argv.appengine + '/dev_appserver.py';
var params = {
  admin_host: '0.0.0.0',
  admin_port: 8000,
  host: '0.0.0.0',
  port: 8181
};

if (argv.clear_datastore) {
  params.clear_datastore = true;
}

if (argv.enable_sendmail) {
  params.enable_sendmail = argv.enable_sendmail;
}

gulp.task('gulp-serve', function() {
  gulp.src('app/app.yaml')
    .pipe(gae('dev_appserver.py', [], {
      admin_host: '0.0.0.0',
      admin_port: 8000,
      host: '0.0.0.0',
      port: 8181
    }));
});

// Not sure if we can use this
gulp.task('gulp-deploy', function() {
  gulp.src('app/app.yaml')
    .pipe(gae('appcfg.py', ['update'], {
      // For value-less parameters
      oauth2: undefined,
      version: 'dev'
    }));
});

gulp.task('default', ['gulp-serve']);
