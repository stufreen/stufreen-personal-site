'use strict';

var gulp = require('gulp'),
  cleanDest = require('gulp-clean-dest'),
  sass = require('gulp-sass'),
  autoprefixer = require('gulp-autoprefixer'),
  cleanCSS = require('gulp-clean-css'),
  metalsmith = require('metalsmith'),
  sourcemaps = require('gulp-sourcemaps'),
  layouts = require('metalsmith-layouts'),
  concat = require('gulp-concat'),
  markdown = require('metalsmith-markdown'),
  collections = require('metalsmith-collections'),
  jshint = require('gulp-jshint'),
  uglify = require('gulp-uglify'),
  babel = require('gulp-babel');

var paths = {
  dev: {
    js: ['src/js/**/*.js'],
    vendorjs: ['src/vendor/**/*.js'],
    vendorcss: ['src/vendor/**/*.css'],
  },
  build: {
    js: 'build/assets/js/',
    css: 'build/assets/css/',
  },
};

//error handler helper for jshint
function handleError(error) {
  console.log(error.toString());
  // this.emit('end');
  gutil.beep();
}

// build HTML files using Metalsmith
function html(done) {
  metalsmith(__dirname) // the working directory
    .clean(false) // clean the build directory
    .source('src/html/') // the page source directory
    .destination('build/') // the destination directory
    .use(markdown()) // convert markdown to HTML
    .use(
      collections({
        // determine page collection/taxonomy
        projects: {
          pattern: 'projects/**/*',
          sortBy: 'priority',
          reverse: true,
          metadata: {
            isProject: true,
          },
        },
      })
    )
    .use(
      layouts({
        engine: 'handlebars',
        directory: './src/template',
        partials: './src/partials',
        default: 'page.html',
        pattern: ['*/*/*html', '*/*html', '*html'],
      })
    )
    .build(function (err) {
      // build the site
      if (err) throw err; // and throw errors
      done();
    });
}

// Build css using sass
function styles() {
  return gulp
    .src('src/scss/*.scss')
    .pipe(sourcemaps.init())
    .pipe(concat('style.min.scss'))
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer('last 3 versions', '> 1%', 'ie 9'))
    .pipe(cleanCSS({compatibility: 'ie9'}))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('build/assets/css'));
}

// Simply copies assets folder to build directory
function assets() {
  return gulp
    .src(['src/assets/**/*'])
    .pipe(cleanDest('build/assets'))
    .pipe(gulp.dest('build/assets'));
}

// Build js with babel and concat
function transpileJs() {
  return gulp
    .src(paths.dev.js)
    .pipe(concat('app.min.js'))
    .on('error', handleError)
    .pipe(
      babel({
        presets: ['es2015'],
      })
    )
    .on('error', console.error)
    .pipe(uglify())
    .pipe(gulp.dest(paths.build.js));
}

const scripts = gulp.series(lint, transpileJs);

// Bundle vendor js files
function vendorjs() {
  return gulp
    .src(paths.dev.vendorjs)
    .pipe(concat('vendor.js'))
    .on('error', handleError)
    .pipe(uglify())
    .pipe(gulp.dest(paths.build.js));
}

// Bundle vendor css files
function vendorcss() {
  return gulp
    .src(paths.dev.vendorcss)
    .pipe(concat('vendor.css'))
    .on('error', handleError)
    .pipe(gulp.dest(paths.build.css));
}

// Lint js
function lint() {
  return gulp
    .src(paths.dev.js)
    .pipe(jshint())
    .on('error', handleError)
    .pipe(jshint.reporter('jshint-stylish'))
    .on('error', handleError);
}

function watch() {
  gulp.watch('src/**/*.md', html);
  gulp.watch('src/**/*.html', html);
  gulp.watch('src/**/*.scss', styles);
  gulp.watch('src/**/*.js', scripts);
}

const buildAndWatch = gulp.series(styles, scripts, assets, html, watch);

const build = gulp.series(styles, scripts, assets, html, vendorjs, vendorcss);

exports.default = buildAndWatch;
exports.build = build;
