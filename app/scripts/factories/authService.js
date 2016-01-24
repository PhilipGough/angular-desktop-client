angular.module('BetterBetting')

.factory('authFactory', [ '$window', '$http', '$rootScope',
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
