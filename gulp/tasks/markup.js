var gulp = require('gulp');
var del = require('del');
var config = require('../config');

gulp.task('markup', function() {
  return gulp.src(config.debug.views + '/index.html')
    .pipe(gulp.dest(config.production.dest))
});
