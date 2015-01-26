var gulp      = require('gulp');
var config    = require('../config');
var minifyCSS = require('gulp-minify-css');
var size      = require('gulp-filesize');

gulp.task('minifyCss', ['clean:prod', 'markup'], function() {
    return gulp.src(config.css.src)
        .pipe(minifyCSS({keepBreaks:true}))
        .pipe(gulp.dest(config.css.dest))
        .pipe(size());
})
