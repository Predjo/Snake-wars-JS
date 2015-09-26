'use strict';

var gulp        = require('gulp');
var source      = require('vinyl-source-stream');
var gutil       = require('gulp-util');
var streamify   = require('gulp-streamify');
var $           = require('gulp-load-plugins')();
var del         = require('del');
var watchify    = require('watchify');
var babelify    = require('babelify');
var babel       = require('gulp-babel');
var browserify  = require('browserify');
var eslint      = require('gulp-eslint');
var browserSync = require('browser-sync');

var exports = {

  buildJS: function(browserifyPaths, sourcePath, destinationPath) {
    var uglify = require('gulp-uglify');
    var isProd = false;
    return browserify(browserifyPaths, {
      debug: !isProd
    })
    .transform(babelify.configure({
      optional: ['es7.classProperties', 'es7.decorators']
    }))
    .bundle()
    .on('error', console.log.bind(console))
    .pipe(source(sourcePath))
    .pipe(isProd ? streamify(uglify()) : gutil.noop())
    .pipe(gulp.dest(destinationPath));
  },

  babelJS: function(sourcePath, destinationPath) {
    return gulp.src(sourcePath)
        .pipe(babel({ optional: ['es7.classProperties', 'es7.decorators'] }))
        .pipe(gulp.dest(destinationPath));
  },

  watchifyBundle: function(browserifyPaths) {
    return watchify(browserify(browserifyPaths, {
      cache: {},
      packageCache: {},
      fullPaths: true,
      debug: true
    }).transform(babelify.configure({
      optional: ['es7.classProperties', 'es7.decorators']
    })));
  },

  buildScss: function(sourcePath, destinationPath) {
    var sass = require('gulp-sass');
    gulp.src(sourcePath)
        .pipe(sass())
        .pipe(sass({errLogToConsole: true}))
        .pipe(gulp.dest(destinationPath));
  },

  copy: function(sourcePath, destinationPath) {
    return gulp.src(sourcePath)
        .pipe(gulp.dest(destinationPath));
  },

  copyFonts: function(sourcePath, destinationPath) {
    return gulp.src(sourcePath)
        .pipe($.filter('**/*.{eot,svg,ttf,woff,woff2,otf}'))
        .pipe($.flatten())
        .pipe(gulp.dest(destinationPath));
  },

  clean: function(sourcePath) {
    del([sourcePath]);
  },

  eslint: function(sourcePath) {
    return gulp.src([sourcePath])
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failOnError());
  },

  browserSyncInit: function(baseDir, files, browser) {
    browser = browser === undefined ? 'default' : browser;

    browserSync.instance = browserSync.init(files, {
      startPath: '/',
      proxy: 'http://0.0.0.0:8080',
      browser: browser,
      index: '/firms/arazoo/members.html'
    });
  }
};

module.exports = exports;
