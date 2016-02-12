// Include gulp
var gulp = require('gulp'); 

// Include Our Plugins
var jshint = require('gulp-jshint');
var sass = require('gulp-sass');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var del = require('del');
var rjs = require('requirejs');

// Lint Task
gulp.task('lint', function() {
    return gulp.src(['js/**/*.js', '!js/lib/**/*', '!js/require.js'])
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

// Compile Our Sass
gulp.task('sass', function() {
    return gulp.src('scss/**/main.scss')
        .pipe(sass({ compass: true, bundleExec: true, outputStyle: 'compressed', sourcemap: true, sourcemapPath: '/css' }))
        .pipe(gulp.dest('css'));
});

// Concatenate & Minify JS
gulp.task('build', function(cb){
  rjs.optimize({
    appDir: './js',
    baseUrl: './lib',
    paths: {
      app: '../app',
      jquery: 'jquery-2.2.0',
      socketio: 'socket.io'
    },
    dir: './dist',
    removeCombined: true,
    optimize: "uglify2",
    generateSourceMaps: false,
    preserveLicenseComments: false,
    fileExclusionRegExp: /^\.|^node_modules|Gruntfile.js|Gulpfile.js|package.json|.*bat$|3rdpartybackup|uploads|.*scss$|.*eps$|.*log$/i,
    modules: [{
        name: '../config'
    }]
  }, function(buildResponse){
    // console.log('build response', buildResponse);
    cb();
  }, cb);
});

// Clear the release folder
gulp.task('clean', function() {
  return del.sync('../www/**', {force: true});
});

// Copy files to release folder
gulp.task('copy_release', ['clean', 'lint', 'sass', 'build'], function() {
  gulp.src('./app/**').pipe(gulp.dest('../www/app'));
  gulp.src('./css/**').pipe(gulp.dest('../www/css'));
  gulp.src('./dist/**').pipe(gulp.dest('../www/js'));
  gulp.src('./img/**').pipe(gulp.dest('../www/img'));
  gulp.src('./mustache/**').pipe(gulp.dest('../www/mustache'));
  gulp.src('./node_modules/**').pipe(gulp.dest('../www/node_modules'));
  gulp.src('./planningPoker.js').pipe(gulp.dest('../www'));
  gulp.src('./index.html').pipe(gulp.dest('../www'));
  gulp.src('./.gitignore').pipe(gulp.dest('../www'));
  return;
});

// Watch Files For Changes
gulp.task('watch', function() {
    gulp.watch(['js/**/*.js'], ['lint', 'build']);
    gulp.watch('scss/**/*.scss', ['sass']);
});

// Default Task
gulp.task('default', ['lint', 'sass', 'build', 'watch']);
// Release
gulp.task('release', ['copy_release']);