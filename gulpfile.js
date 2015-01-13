var gulp = require('gulp'),
    bundle = require('gulp-bundle-assets'),
    ngAnnotate = require('gulp-ng-annotate'),
    del = require('del'),
   request = require('request');

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

gulp.task('request', function(cb) {
    for(var r=0; r<100; r++) {
        request('http://myxph.com/handlers/songs.ashx?term=Habangbuhay+-+G3+Misa', function (error, response, body) {
            if (!error && response.statusCode == 200) {
                console.log(response.statusCode); //
            }
        });
    }

});

