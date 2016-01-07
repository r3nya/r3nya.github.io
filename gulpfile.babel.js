import gulp from 'gulp';

gulp.task('html-minify', () => {
  let htmlmin = require('gulp-htmlmin');

  return gulp.src('index.html')
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest('dist'))
});

gulp.task('css-minify', () => {
  let sass = require('gulp-sass');
  let minifyCss = require('gulp-minify-css');
  let cncat = require('gulp-concat');
  let uncss = require('gulp-uncss');

  return gulp.src('style.scss')
    .pipe(sass({
      outputStyle: 'compressed',
      includePaths: [
        './node_modules/skeleton-scss/scss/',
        './node_modules/font-awesome/scss/'
      ]
    }))
    .pipe(cncat('style.css'))
    .pipe(uncss({
        html: ['index.html']
    }))
    .pipe(minifyCss({keepSpecialComments : 0}))
    .pipe(gulp.dest('dist/css'));
});

gulp.task('copy-fonts', () => {
  return gulp.src(['./node_modules/font-awesome/fonts/**/*'])
    .pipe(gulp.dest('dist/fonts'));
});

gulp.task('default', ['css-minify', 'html-minify', 'copy-fonts']);
