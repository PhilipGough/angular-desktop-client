'use strict';

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
  'BetterBetting.pundit.event.selection',
  'flash',
  'ngMessages',
  'nya.bootstrap.select'
]);


BetterBetting.config(function($stateProvider, $locationProvider,$httpProvider,
                     $urlRouterProvider, $translateProvider, $compileProvider){


  //allow local assets CSP
  $compileProvider.imgSrcSanitizationWhitelist(/^\s*(https?|ftp|file|chrome-extension):|data:image\//);
  $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|file|chrome-extension):/);

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

  $stateProvider.state('preAuth', {
    url: '',
    abstract: true,
    templateUrl: 'partials/preAuth/landing.tpl.html'
  });

  //$httpProvider.defaults.withCredentials = true;
  //No states are matched, use this as the fallback
  //$locationProvider.html5Mode(true);
  $urlRouterProvider.otherwise('/');
  //Set Up Translation Provider
  $translateProvider
    .preferredLanguage('en')
    .useLocalStorage()
    .useStaticFilesLoader({ prefix: '/copy/', suffix: '.json' })
    .useSanitizeValueStrategy('escaped');
});

BetterBetting.run(function($rootScope, $state, $stateParams){
   $rootScope.baseURL = 'http://localhost:5000/';
   $rootScope.$state = $state;
   $rootScope.$stateParams = $stateParams;
});

BetterBetting.controller('MainCtrl', function(){

});





