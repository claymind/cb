var gulp = require('gulp');
var bundle = require('gulp-bundle-assets');


gulp.task('bundle', function() {
    return gulp.src('./bundle.config.js')
        .pipe(bundle())
        .pipe(bundle.results({
            dest: './production/js',
            pathPrefix: 'production/js/',
            fileName: 'manifest'
        }))
        .pipe(gulp.dest('./production/js'));
});

