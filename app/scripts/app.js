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
  'flash',
  'ngMessages'
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

BetterBetting.factory('authFactory', [ '$window', '$http', '$rootScope',
   function($window, $http, $rootScope) {

    var authFactory = {};
    var user = {};

    authFactory.isAuthenticated = function() {
      var token = this.getStoredToken();
      if(token) {
        var params = this.parseJwt(token);
        return Math.round(new Date().getTime() / 1000) <= params.exp;
      } else {
          return false;
      }
    };

    authFactory.getUserData = function() {
     return user;
    };

    authFactory.setUserData = function(token) {
      var parsedJWT = this.parseJWT(token);
      user.name = parsedJWT.name;
      user.id = parsedJWT.sub;
      user.hasPermission = parsedJWT.role;
    };

    authFactory.getAuthToken = function(email, password) {
        return $http({
          method: 'post',
          url: $rootScope.baseURL +'token',
          contentType: 'application/json',
          data: {
              email: email,
              password: password
          }
      });
    };

    authFactory.getStoredToken = function() {
      return localStorage.getItem('betterTradingToken');
    };

    authFactory.parseJWT = function(token) {
      var base64Url = token.split('.')[1];
      var base64 = base64Url.replace('-', '+').replace('_', '/');
      return JSON.parse($window.atob(base64));
    };
    return authFactory;
}]);




