var gulp      = require('gulp');
var config    = require('../config');
var minifyCSS = require('gulp-minify-css');
var size      = require('gulp-filesize');

gulp.task('minifyCss', function() {
  return gulp.src(config.debug.cssSrc)
    .pipe(minifyCSS({keepBreaks:true}))
    .pipe(gulp.dest('./production/css'))
    .pipe(size());
})
