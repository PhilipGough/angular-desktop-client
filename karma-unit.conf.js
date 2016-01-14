module.exports = function(config) {
  config.set({
    frameworks: ['jasmine'],
    browsers: ['Firefox', 'PhantomJS'],
    port : 5555,
    files : [
      'app/bower_components/angular/angular.js',
      'https://cdnjs.cloudflare.com/ajax/libs/angular.js/1.4.6/angular-mocks.js',
      'app/bower_components/angular-ui-router/release/angular-ui-router.min.js',
      'app/bower_components/angular-flash-alert/dist/angular-flash.js',
      'app/bower_components/angular-bootstrap/ui-bootstrap.min.js',
      'app/bower_components/angular-translate/angular-translate.min.js',
      'app/bower_components/angular-cookies/angular-cookies.min.js',
      'app/bower_components/angular-translate-storage-local/angular-translate-storage-local.min.js',
      "app/bower_components/angular-translate-storage-cookie/angular-translate-storage-cookie.min.js",
      "app/bower_components/angular-translate-loader-static-files/angular-translate-loader-static-files.min.js",
      'app/scripts/app.js',
      'app/scripts/modules/*/*.js',
      'tests/unit/*.js'
    ]
  });
};
