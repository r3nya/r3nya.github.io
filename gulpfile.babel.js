import gulp from 'gulp'

gulp.task('html', () => {
  let pug = require('gulp-pug')

  return gulp.src('src/html/index.pug')
    .pipe(pug())
    .pipe(gulp.dest('dist'))
})

gulp.task('css', () => {
  let postcss = require('gulp-postcss')
  let autoprefixer = require('autoprefixer')
  let postcssImport = require('postcss-import')
  let postcssSimpleVars = require('postcss-simple-vars')
  let postcssNesting = require('postcss-nesting')
  let customMedia = require('postcss-custom-media')
  let mqpacker = require('css-mqpacker')

  let minifyCss = require('gulp-minify-css')
  let cncat = require('gulp-concat')
  let purify = require('gulp-purifycss')

  const processors = [
    autoprefixer({ browsers: ['> 5%'] }),
    postcssImport(),
    postcssNesting(),
    postcssSimpleVars(),
    customMedia(),
    mqpacker()
  ]

  return gulp.src('src/style/main.css')
    .pipe(postcss(processors))
    .pipe(cncat('style.css'))
    .pipe(purify(['dist/index.html']))
    .pipe(minifyCss({ keepSpecialComments: 0 }))
    .pipe(gulp.dest('dist/css'))
})

gulp.task('fonts', () => {
  return gulp.src(['./node_modules/font-awesome/fonts/**/*'])
    .pipe(gulp.dest('dist/fonts'))
})

gulp.task('clean', () => {
  let del = require('del')

  return del([ 'dist' ])
})

gulp.task('w', () => {
  return gulp.watch(
    'src/**/*.(pug|css)',
    gulp.parallel('html', 'css')
  )
})

gulp.task('default',
  gulp.series('clean',
    gulp.series('html',
      gulp.parallel('css', 'fonts')
    )
  )
)
