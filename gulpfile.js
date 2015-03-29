var gulp    = require('gulp'),
    csso    = require('gulp-csso'),
    cncat   = require('gulp-concat'),
    uncss   = require('gulp-uncss'),
    htmlmin = require('gulp-htmlmin');

gulp.task('html-minify', function () {
  return gulp.src('index.html')
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest('dist'))
});

gulp.task('css-minify', function () {
    return gulp.src([
        'components/skeleton/css/*.css',
        'components/font-awesome/css/font-awesome.css',
        'style.css'
        ])
        .pipe(cncat('style.css'))
        .pipe(uncss({
            html: ['index.html']
        }))
        .pipe(csso())
        .pipe(gulp.dest('dist/css'));
});

gulp.task('copy-fonts', function () {
    gulp.src(['components/font-awesome/fonts/**/*'])
        .pipe(gulp.dest('dist/fonts'));
});

gulp.task('default', ['css-minify', 'html-minify', 'copy-fonts']);
