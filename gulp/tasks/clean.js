var gulp = require('gulp');
var del = require('del');
var config = require('../config');

gulp.task('clean:prod', function () {
    return del([
        config.production.dest
    ]);
});