import gulp from 'gulp'
import size from 'gulp-filesize'

gulp.task('html', () => {
  const pug = require('gulp-pug')
  const minifyInline = require('gulp-minify-inline')

  return gulp.src('src/html/index.pug')
    .pipe(pug())
    .pipe(minifyInline())
    .pipe(gulp.dest('dist'))
    .pipe(size())
})

gulp.task('css', () => {
  const postcss = require('gulp-postcss')
  const cleanCss = require('gulp-clean-css')
  const cncat = require('gulp-concat')
  const purify = require('gulp-purifycss')
  const csso = require('gulp-csso')

  const processors = [
    require('postcss-devtools')(),
    require('autoprefixer')({ browsers: ['> 5%'] }),
    require('postcss-import')(),
    require('postcss-nesting')(),
    require('postcss-custom-media')(),
    require('postcss-css-variables')(),
    require('postcss-flexbugs-fixes')(),
    require('css-mqpacker')()
  ]

  return gulp.src('src/style/main.css')
    .pipe(postcss(processors))
    .pipe(cncat('style.css'))
    .pipe(purify(['dist/index.html']))
    .pipe(cleanCss({ level: { 1: { specialComments: false } } }))
    .pipe(csso())
    .pipe(gulp.dest('dist/css'))
    .pipe(size())
})

gulp.task('sw-toolbox', () => {
  return gulp.src(['./node_modules/sw-toolbox/sw-toolbox.js'])
    .pipe(gulp.dest('dist/js'))
})

gulp.task('sw', () => {
  const uglify = require('gulp-uglify')

  return gulp.src(['./src/js/sw.js'])
    .pipe(uglify())
    .pipe(gulp.dest('dist/js'))
})

gulp.task('fonts', () => {
  return gulp.src(['./node_modules/font-awesome/fonts/**/*'])
    .pipe(gulp.dest('dist/fonts'))
    .pipe(size())
})

gulp.task('humans', () => {
  const humans = require('gulp-humans')
  const lastUpdate = (new Date()).toISOString().split('T')[0].split('-').join('/')

  return gulp.src('dist/index.html')
    .pipe(humans({
      team: [
        'Author: Andrey M.',
        'Email: me@r3nya.ru'
      ],
      site: [
        `Last update: ${lastUpdate}`,
        'Standards: HTML5, CSS3',
        'Components: Normalize.css',
        'Software: VSCode'
      ]
    }))
    .pipe(gulp.dest('dist/'))
})

gulp.task('favicon', () => (
  gulp.src([
    './src/assets/apple-touch-icon.png',
    './src/assets/favicon-16x16.png',
    './src/assets/favicon-32x32.png',
    './src/assets/favicon.ico',
    './src/assets/safari-pinned-tab.svg',
  ])
    .pipe(gulp.dest('./dist'))
));

gulp.task('clean', () => {
  const del = require('del')

  return del(['dist'])
})

gulp.task('open', () => {
  const open = require('gulp-open')

  return gulp.src('dist/index.html')
    .pipe(open())
})

gulp.task('cname', () => {
  return gulp.src('./src/CNAME')
    .pipe(gulp.dest('./dist'))
})

gulp.task('w', () => (
  gulp.watch(
    'src/**/*.(pug|css)',
    gulp.parallel('html', 'css')
  )
))

gulp.task('default',
  gulp.series('clean',
    gulp.series('html',
      gulp.parallel('css', 'fonts', 'humans', 'cname', 'sw', 'sw-toolbox', 'favicon')
    )
  )
)
