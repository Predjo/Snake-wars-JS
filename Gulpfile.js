'use strict';

var gulp          = require('gulp');
var gutil         = require('gulp-util');
var source        = require('vinyl-source-stream');
var taskFunctions = require('./gulp/tasks');


gulp.task('default', ['clean'], function() {
  gulp.start('build');
});

// cleaning tasks
gulp.task('clean:client-js', function() {
  taskFunctions.clean('./dist/public/js/');
});

gulp.task('clean:server-js', function() {
  taskFunctions.clean('./dist/server/*');
});

gulp.task('clean:shared-js', function() {
  taskFunctions.clean('./dist/shared/*');
});

gulp.task('clean:css', function() {
  taskFunctions.clean('./dist/public/css');
});

gulp.task('sass', ['clean:css'], function() {
  taskFunctions.buildScss('./src/client/styles/**/*.scss', './dist/public/css/');
});

gulp.task('eslint', function() {
  taskFunctions.eslint('./src/**/*.js*');
});

gulp.task('client-js', [], function() {
  taskFunctions.buildJS(['./src/client/app.js'], './app.js', './dist/public/js/');
});

gulp.task('server-js', ['templates'], function() {
  taskFunctions.babelJS('./src/server/**/*.js*','./dist/server/');
});

gulp.task('shared-js', [], function() {
  taskFunctions.babelJS('./src/shared/**/*.js*','./dist/shared/');
});

gulp.task('js', ['clean:client-js', 'clean:server-js', 'clean:shared-js', 'shared-js', 'client-js', 'server-js']);

gulp.task('templates', function() {
  taskFunctions.copy('./src/views/**/*.handlebars', 'dist/views/');
});

gulp.task('watch', ['build'], function(){
  var bundler = taskFunctions.watchifyBundle(['./src/client/app.js']);

  function rebundle() {
    var t = Date.now();
    gutil.log('Starting Watchify rebundle');
    return bundler.bundle()
    .pipe(source('app.js'))
    .pipe(gulp.dest('./dist/public/js/'))
    .on('end', function() {
      gutil.log('Finished bundling after:', gutil.colors.magenta(Date.now() - t + ' ms'));
    });
  }

  bundler.on('update', rebundle);
  gulp.watch('./src/client/**/*.js*', ['eslint']);
  gulp.watch('./src/shared/**/*.js*', ['eslint', 'shared-js', 'server-js']);
  gulp.watch('./src/server/**/*.js*', ['eslint', 'server-js']);
  gulp.watch('./src/client/**/*.scss', ['sass']);

  //return rebundle();
});

gulp.task('build', ['sass', 'js']);

gulp.task('default', ['build']);
