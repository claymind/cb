var gulp = require('gulp');
var del = require('del');
var config = require('../config');

gulp.task('markup', ['clean:prod'], function() {
    return gulp.src(config.markup.src)
        .pipe(gulp.dest(config.markup.dest))
});
