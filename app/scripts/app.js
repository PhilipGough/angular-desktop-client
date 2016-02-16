/**
 * @author - Philip Gough
 * @description - Better Trading front end application. The application is split in logic
 * between a user and a pundit and the user will be routed accordingly based on credentials
 * recieved from the API within the JSON Web Token.
 *
 */
'use strict';
/**
 * Instantiating the main application module and injecting required dependencies
 * @type Angular module
 */
var BetterBetting = angular.module('BetterBetting', [
  'ui.bootstrap',
  'ui.router',
  'uiRouterStyles',
  'ngCookies',
  'pascalprecht.translate',
  'BetterBetting.home',
  'BetterBetting.login',
  'BetterBetting.register',
  'BetterBetting.pundit',
  'BetterBetting.pundit.event',
  'BetterBetting.pundit.selection',
  'BetterBetting.pundit.createEvent',
  'BetterBetting.user',
  'BetterBetting.user.punditProfile',
  'flash',
  'ngMessages',
  'nya.bootstrap.select',
  'angularUtils.directives.dirPagination',
  'chart.js',
  'ngDialog',
  'templates'
]);

// Module to be populated by gulp templateCache in production build
angular.module('templates', []);


BetterBetting.config(function($stateProvider, $locationProvider,$httpProvider,
                     $urlRouterProvider, $translateProvider, $compileProvider){


  //allow local assets CSP
  $compileProvider.imgSrcSanitizationWhitelist(/^\s*(https?|ftp|file|chrome-extension):|data:image\//);
  $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|file|chrome-extension):/);

  $stateProvider.state('404', {
    url: '/404',
    data : {
      restricted: false
    },
    abstract: false,
    templateUrl: 'partials/errors/404.tpl.html',
    controller: function ($scope, $rootScope, $state, $window) {
      $scope.back = function() {
        $window.history.back();
      }
    }
  });

  $stateProvider.state('pundit', {
    url: '/pundit',
    data : {
      restricted: true,
      css: 'bower_components/rdash-ui/dist/css/rdash.min.css'
    },
    abstract: true,
    templateUrl: 'partials/pundit/pundit.tpl.html',
    controller: 'PunditHomeCtrl'
  });

  $stateProvider.state('user', {
    url: '/user',
    data : {
      restricted: true,
      css: 'bower_components/rdash-ui/dist/css/rdash.min.css'
    },
    abstract: true,
    templateUrl: 'partials/user/user.tpl.html',
    controller: 'UserHomeCtrl',
    resolve : {
      setBodyClass : function($document) {
            return $document.find('body')[0].id = 'pundit';
          }
    }
  });

  $stateProvider.state('preAuth', {
    url: '',
    abstract: true,
    templateUrl: 'partials/preAuth/landing.tpl.html',
    resolve : {
      setBodyClass : function($document) {
            return $document.find('body')[0].id = 'normal';
          }
    }
  });

  $httpProvider.interceptors.push('httpErrorResponseInterceptor');

  //$httpProvider.defaults.withCredentials = true;
  //No states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/');
  //Set Up Translation Provider
  $translateProvider
    .preferredLanguage('en')
    .useLocalStorage()
    .useStaticFilesLoader({ prefix: '/copy/', suffix: '.json' })
    .useSanitizeValueStrategy('escaped');
});

BetterBetting.run(function($rootScope, $state, $stateParams, $templateCache){
   $rootScope.baseURL = 'http://localhost:5000/';
   $rootScope.$state = $state;
   $rootScope.$stateParams = $stateParams;
   //$rootScope.$on('$stateChangeSuccess', function(event, to, toParams, from, fromParams) {
     //   $rootScope.previousState = from;
       // $rootScope.previousParams = fromParams;
    //});
});

BetterBetting.controller('MainCtrl', function(){

});





