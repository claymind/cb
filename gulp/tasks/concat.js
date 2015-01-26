var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var gulp = require('gulp');
var config = require('../config');

gulp.task('concat', ['clean:prod', 'markup', 'minifyCss', 'templateCache', 'images'], function () {
    gulp.src(config.concat['angular-host'].scripts)
        .pipe(uglify())
        .pipe(concat({ path: 'angular-host.js' }))
        .pipe(gulp.dest(config.js.dest));

    gulp.src(config.concat['rules-builder'].scripts)
        .pipe(uglify())
        .pipe(concat({ path: 'rules-builder.js' }))
        .pipe(gulp.dest(config.js.dest));
});

