'use strict';

var
  gulp        = require('gulp'),
  cleanDest   = require('gulp-clean-dest'),
  sass        = require('gulp-sass'),
  autoprefixer = require('gulp-autoprefixer'),
  cleanCSS    = require('gulp-clean-css'),
  metalsmith  = require('metalsmith'),
  rename      = require('gulp-rename'),
  sourcemaps  = require('gulp-sourcemaps'),
  layouts     = require('metalsmith-layouts'),
  concat      = require('gulp-concat'),
  handlebars  = require('handlebars'),
  markdown    = require('metalsmith-markdown'),
  collections = require('metalsmith-collections');

// build HTML files using Metalsmith
gulp.task('html', function() {

  let ms = metalsmith(__dirname) // the working directory
    .clean(false)            // clean the build directory
    .source('src/html/')    // the page source directory
    .destination('build/')  // the destination directory
    .use(markdown())        // convert markdown to HTML
    .use(collections({                  // determine page collection/taxonomy
       projects: {
         pattern:    'projects/**/*',
         sortBy:     'priority',
         reverse:    true,
         metadata: {
           isProject: true
         }
       }
     }))
    .use(layouts({
      engine: 'handlebars',
      directory: './src/template',
      partials: './src/partials',
      default: 'page.html',
      pattern: ["*/*/*html","*/*html","*html"]
    }))
    .build(function(err) {  // build the site
      if (err) throw err;   // and throw errors
    });

});

// Build css using sass
gulp.task('styles', function() {
  return gulp.src('src/scss/*.scss')
    .pipe(sourcemaps.init())
    .pipe(concat('style.scss'))
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer("last 3 versions", "> 1%", "ie 9"))
    .pipe(cleanCSS({compatibility: 'ie9'}))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('build/assets/css'));
});

// Simply copies assets folder to build directory
gulp.task('assets', function() {
  return gulp.src(['src/assets/**/*'])
    .pipe(cleanDest('build/assets'))
    .pipe(gulp.dest('build/assets'));
});

// Simply copies js folder to build directory
gulp.task('js', function() {
  return gulp.src(['src/js/**/*'])
    .pipe(cleanDest('build/assets/js'))
    .pipe(gulp.dest('build/assets/js'));
});

gulp.task('watch', function() {
    gulp.watch('src/**/*.md', ['html']);
    gulp.watch('src/**/*.html', ['html']);
    gulp.watch('src/**/*.scss', ['styles']);
    gulp.watch('src/**/*.js', ['js']);
});

gulp.task('default', [ 'styles', 'js', 'assets', 'html', 'watch' ]);