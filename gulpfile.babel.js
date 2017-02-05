import gulp from 'gulp'

gulp.task('html', () => {
  const pug = require('gulp-pug')

  return gulp.src('src/html/index.pug')
    .pipe(pug())
    .pipe(gulp.dest('dist'))
})

gulp.task('css', () => {
  const postcss = require('gulp-postcss')
  const cleanCss = require('gulp-clean-css')
  const cncat = require('gulp-concat')
  const purify = require('gulp-purifycss')

  const processors = [
    require('postcss-devtools')(),
    require('autoprefixer')({ browsers: ['> 5%'] }),
    require('postcss-import')(),
    require('postcss-nesting')(),
    require('postcss-custom-media')(),
    require('postcss-css-variables')(),
    require('css-mqpacker')()
  ]

  return gulp.src('src/style/main.css')
    .pipe(postcss(processors))
    .pipe(cncat('style.css'))
    .pipe(purify(['dist/index.html']))
    .pipe(cleanCss({ keepSpecialComments: 0 }))
    .pipe(gulp.dest('dist/css'))
})

gulp.task('fonts', () => {
  return gulp.src(['./node_modules/font-awesome/fonts/**/*'])
    .pipe(gulp.dest('dist/fonts'))
})

gulp.task('humans', () => {
  const humans = require('gulp-humans')

  return gulp.src('dist/index.html')
    .pipe(humans({
      team: [
        'Author: Andrey M.',
        'Email: me@r3nya.ru'
      ],
      site: [
        'Standards: HTML5, CSS3',
        'Components: Normalize.css',
        'Software: Atom'
      ]
    }))
    .pipe(gulp.dest('dist/'))
})

gulp.task('clean', () => {
  const del = require('del')

  return del([ 'dist' ])
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
      gulp.parallel('css', 'fonts', 'humans')
    )
  )
)
