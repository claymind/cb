var gulp = require('gulp'),
    bundle = require('gulp-bundle-assets'),
    ngAnnotate = require('gulp-ng-annotate'),
    del = require('del');

var paths = {
    scripts: './public/scripts/{,*/}*.js'
}

gulp.task('annotate', function () {
    return gulp.src(paths.scripts)
        .pipe(ngAnnotate())
        .pipe(gulp.dest('dist/scripts'));
});

gulp.task('bundle', function() {
    return gulp.src('./bundle.config.js')
        .pipe(bundle())
        .pipe(gulp.dest('./dist'));
});

gulp.task('clean:dist', function (cb) {
    del([
        './dist/scripts/{,*/}*'
    ], cb);
});


