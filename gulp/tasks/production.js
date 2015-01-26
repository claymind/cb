var gulp = require('gulp');

// Run this to compress all the things!
gulp.task('production', ['clean:prod', 'markup', 'minifyCss', 'templateCache', 'images', 'concat']);