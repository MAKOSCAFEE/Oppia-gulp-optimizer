var gulp = require('gulp');
// Find index.js file
var gae = require('../');

gulp.task('gulp-serve', function() {
  gulp.src('app/app.yaml')
    .pipe(gae('dev_appserver.py', [], {
      admin_host: '0.0.0.0',
      admin_port: 8001,
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
