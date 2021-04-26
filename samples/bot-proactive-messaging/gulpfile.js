const gulp = require('gulp');
const zip = require('gulp-zip');
const del = require('del');

gulp.task('clean', function(done) {
    return del([
        'publish/**/*'
    ], done);
});

gulp.task('generate-manifest', function(done) {
    gulp.src(['static/images/contoso*', 'src/manifest.json'])
        .pipe(zip('ProativeMessagingSample.zip'))
        .pipe(gulp.dest('publish'), done);
    done();
});

gulp.task('default', gulp.series('clean', 'generate-manifest'), function(done) {
    console.log('Build completed. Output in `publish` folder');
    done();
});