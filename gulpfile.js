'use strict';

//Setup
var config = require('./config/config.js'); //Load Config Variables
var gulp = require('gulp');
var $ = require('gulp-load-plugins')(); //load plugins
var del = require('del');
var gulpFilter = require('gulp-filter');
var useref = require('gulp-useref');
var runSequence = require('run-sequence');
var browserSync = require('browser-sync');
var pagespeed = require('psi');
var templateCache = require('gulp-angular-templatecache');
var reload = browserSync.reload;

//Test Runner
var Server = require('karma').Server;


//Process Settings
var Settings = {
  'NODE_ENV': config.get('env'),
  'MOBILE': config.get('mobile'),
  'MINIFY': { empty: true, cdata: true, spare: true, quotes: true }
};

if(Settings.NODE_ENV === "development"){
  Settings.SERVEFROM = ['./.tmp', './app']
} else if(Settings.NODE_ENV === "mobile"){
  Settings.SERVEFROM = ['./cordova/www/']
}else{
  Settings.SERVEFROM = ['./dist/']
};

// Lint JS
gulp.task('jshint', function () {
  return gulp.src(['./app/scripts/**/*.js', '!./app/scripts/lib/**/*.js', '!./app/scripts/templates.js'])
    .pipe(reload({stream: true, once: true}))
    .pipe($.jshint())
    .pipe($.jshint.reporter('jshint-stylish'));
});

/**
  ** Optimizations
**/

//Optimize Images
gulp.task('images', function () {
  return gulp.src('app/images/**/*')
    .pipe($.cache($.imagemin({
      progressive: true,
      interlaced: true
    })))
    .pipe(gulp.dest(config.get('build_destination')+'images'))
    .pipe($.size({title: 'images'}));
});

//Process SASS to CSS
gulp.task('styles', function () {
  return gulp.src('app/styles/app.scss')
    .pipe($.rubySass({
      style: 'expanded',
      precision: 10,
      loadPath: ['app/styles']
    }))
    //.pipe($.autoprefixer('last 3 version'))
    .pipe(gulp.dest('.tmp/styles'))
    .pipe($.size());
});


//Copy Fields To Destinations Folder
gulp.task('fonts', function () {
  return gulp.src(['app/fonts/**/*.eot', 'app/fonts/**/*.svg', 'app/fonts/**/*.ttf', 'app/fonts/**/*.woff'])
    .pipe(gulp.dest(config.get('build_destination')+'fonts'))
    .pipe($.size({title: 'fonts'}));
});

gulp.task('copyCommon', function(){
  gulp.src('app/bower_components/**')
    .pipe(gulp.dest(config.get('build_destination')+'bower_components'))
  gulp.src('app/copy/**')
    .pipe(gulp.dest(config.get('build_destination')+'copy'))
  gulp.src('app/assets/**/')
    .pipe(gulp.dest(config.get('build_destination')+'assets'))
  return gulp.src(['app/scripts/**/*.tpl.html', 'app/scripts/**/*.js'])
    .pipe(gulp.dest(config.get('build_destination')+'scripts'));
});

gulp.task('copyServerSpecific', function(){
  return gulp.src(['app/humans.txt', 'app/robots.txt', 'app/background.js'])
    .pipe(gulp.dest(config.get('build_destination')));
});

gulp.task('copyMobileSpecific', function(){
  gulp.src(['app/manifest.json', 'app/manifest.mobile.json', 'app/background.js'])
    .pipe(gulp.dest(config.get('build_destination')))
  return gulp.src('app/res/**/')
    .pipe(gulp.dest(config.get('build_destination')+'res'));
});

//Preprocess Files to remove conditional elements
gulp.task('preprocessDev', function(){
  return gulp.src('app/*.html')
    .pipe($.preprocess({ context: Settings }))
    .pipe(gulp.dest('.tmp/'))
    .pipe($.size());
});

gulp.task('templates', function () {
  return gulp.src('dist/partials/**/*.tpl.html')
    .pipe(templateCache('templatesXXX.js',{root:'partials/'}))
    .pipe(gulp.dest('dist/scripts'));
});

// Scan Your HTML For Assets & Optimize Them
gulp.task('html', function () {
  //var assets = useref.assets({searchPath: '{.tmp,app}'});
  var jsFilter = gulpFilter("**/*.js", {restore: true});
  var test
  var cssFilter = gulpFilter("**/*.css", {restore: true});
  return gulp.src('app/**/*.html')
    .pipe(useref({searchPath: '{.tmp,app}'}))
    // Concatenate And Minify JavaScript
    .pipe(jsFilter)
    //Prepare Angular For Minification
    .pipe($.ngAnnotate())
    //Uglify JS
    .pipe($.uglify())
    .pipe(jsFilter.restore)
    // Concatenate And Minify Styles
    .pipe(cssFilter)
    .pipe($.csso())
    .pipe(cssFilter.restore)
    .pipe($.rev())
    .pipe(useref())
    .pipe($.revReplace())
    // Preprocess HTML
    .pipe($.if('*.html', $.preprocess({ context: Settings })))
    // Minify Any HTML
    .pipe($.if('*.html', $.minifyHtml()))
    // Output Files
    //prepareTemplates()
    //.pipe($.angularTemplatecache(config.get('build_destination')+'/scripts',{}))
    .pipe(gulp.dest(config.get('build_destination')))
    .pipe($.size({title: 'html'}));
});


//Watch Files For Changes & Reload with public ip using browserSync.io
gulp.task('serve', function(){
  browserSync.init(null, {
    server: {
      baseDir: Settings.SERVEFROM
    },
    notify: false
  });
  gulp.watch(['app/**/*.html'], ['preprocessDev'], reload);
  gulp.watch(['.tmp/**/*.html'], reload);
  gulp.watch(['app/**/*.tpl.html'], reload);
  gulp.watch(['app/styles/**/*.{css,scss}'], ['styles']);
  gulp.watch(['.tmp/styles/**/*.css'], reload);
  gulp.watch(['app/scripts/**/*.js'], ['jshint']);
  gulp.watch(['app/images/**/*'], ['images'], reload);
});


/**
 * Watch for file changes and re-run tests on each change
 */
gulp.task('tdd', function (done) {
  new Server({
    configFile: __dirname + '/karma-unit.conf.js'
  }, done).start();
});

/**
  ** TASKS TO CALL
**/

//Development Livereload and Server
gulp.task('develop', function(cb) {
  runSequence(['clean'], ['styles'], ['preprocessDev'], ['serve'], cb);
});

//Clean folders
gulp.task('cleantmp', function(cb){
  return del('./.tmp', {force: true }, cb);
});

gulp.task('cleandist', function(cb){
  return del('./dist', {force: true }, cb);
});

gulp.task('cleancordova', function(cb){
  return del('./cordova/www', {force: true }, cb);
});

gulp.task('clean', ['cleantmp', 'cleandist', 'cleancordova']);


gulp.task('web', function (cb) {
  runSequence(['clean'], ['styles'], ['jshint', 'copyServerSpecific', 'copyCommon', 'fonts', 'images'],
               ['html'], ['templates'], cb);
});

//Build Cordova(Mobile) Apps
gulp.task('mobile', function (cb) {
  runSequence(['clean'], ['styles'], ['jshint', 'copyMobileSpecific', 'copyCommon', 'fonts', 'images'], ['html'], cb);
});


