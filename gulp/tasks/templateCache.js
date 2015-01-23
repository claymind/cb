var templateCache = require('gulp-angular-templatecache');
var gulp = require('gulp');
var config = require('../config');
var TEMPLATE_HEADER = 'angular.module("rulesBuilderApp").run(["$templateCache", function($templateCache) {';

gulp.task('templateCache', function () {
    return gulp.src(config.markup.src)
        .pipe(templateCache('templates.js', { templateHeader: TEMPLATE_HEADER}))
        //.pipe(gulp.dest(config.debug.jsSrc));
        .pipe(gulp.dest(config.debug.jsSrc));
});