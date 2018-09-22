'use strict';

var
  gulp        = require('gulp'),
  cleanDest   = require('gulp-clean-dest'),
  sass        = require('gulp-sass'),
  autoprefixer = require('gulp-autoprefixer'),
  cleanCSS    = require('gulp-clean-css'),
  metalsmith  = require('metalsmith'),
  sourcemaps  = require('gulp-sourcemaps'),
  layouts     = require('metalsmith-layouts'),
  concat      = require('gulp-concat'),
  markdown    = require('metalsmith-markdown'),
  collections = require('metalsmith-collections'),
  jshint      = require('gulp-jshint'),
  uglify      = require('gulp-uglify'),
  babel       = require('gulp-babel');

var paths = {
  dev: {
    js: [
      'src/js/**/*.js'
    ],
    vendorjs: [
      'src/vendor/**/*.js'
    ],
    vendorcss: [
      'src/vendor/**/*.css'
    ]
  },
  build: {
    js: 'build/assets/js/',
    css: 'build/assets/css/'
  }
};

//error handler helper for jshint
function handleError(error){
    console.log(error.toString());
    // this.emit('end');
    gutil.beep();
}

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
    .pipe(concat('style.min.scss'))
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

// Build js with babel and concat
gulp.task('scripts', ['lint'], function() {
  return gulp.src(paths.dev.js)
    .pipe(concat('app.min.js')).on('error', handleError)
    .pipe(babel({
        presets: ['es2015']
    }))
    .on('error', console.error)
    .pipe(uglify())
    .pipe(gulp.dest(paths.build.js));
});

// Bundle vendor js files
gulp.task('vendorjs', [], function() {
  return gulp.src(paths.dev.vendorjs)
    .pipe(concat('vendor.js')).on('error', handleError)
    .pipe(uglify())
    .pipe(gulp.dest(paths.build.js));
});

// Bundle vendor css files
gulp.task('vendorcss', [], function() {
  return gulp.src(paths.dev.vendorcss)
    .pipe(concat('vendor.css'))
    .on('error', handleError)
    .pipe(gulp.dest(paths.build.css));
});

// Lint js
gulp.task('lint', function() {
    return gulp.src(paths.dev.js)
    .pipe(jshint())
    .on('error', handleError)
    .pipe(jshint.reporter('jshint-stylish'))
    .on('error', handleError);
});

gulp.task('watch', function() {
    gulp.watch('src/**/*.md', ['html']);
    gulp.watch('src/**/*.html', ['html']);
    gulp.watch('src/**/*.scss', ['styles']);
    gulp.watch('src/**/*.js', ['scripts']);
});

gulp.task('default', [ 'styles', 'scripts', 'assets', 'html', 'watch' ]);

gulp.task('build', [ 'styles', 'scripts', 'assets', 'html', 'vendorjs', 'vendorcss' ]);