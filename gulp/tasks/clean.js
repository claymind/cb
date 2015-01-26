var gulp = require('gulp');
var del = require('del');
var config = require('../config');

gulp.task('clean:prod', function () {
    return del([
        config.css.dest,
        config.js.dest,
        config.images.dest,
        config.markup.dest + "*.html"
    ]);
});

gulp.task('clean:post', ['clean:prod', 'markup', 'minifyCss', 'templateCache', 'images', 'concat'], function () {
    return del([
        config.templates.dest + "/templates.js"
    ]);
});