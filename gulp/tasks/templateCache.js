var templateCache = require('gulp-angular-templatecache');
var gulp = require('gulp');
var config = require('../config');
var TEMPLATE_HEADER = 'angular.module("rulesBuilderApp").run(["$templateCache", function($templateCache) {';

gulp.task('templateCache', ['clean:prod', 'markup', 'minifyCss'], function () {
    return gulp.src(config.templates.src)
        .pipe(templateCache('templates.js', { templateHeader: TEMPLATE_HEADER}))
        .pipe(gulp.dest(config.templates.dest));
});