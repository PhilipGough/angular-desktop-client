/**
 * Factory to handle any authentication related requests
 */
'use strict';
angular.module('BetterBetting')

.factory('authFactory', [ '$window', '$http', '$rootScope',
   function($window, $http, $rootScope) {

    var authFactory = {};
    var user = {};
    /**
     * Check if user is authenticated
     * @return {Boolean} - Result
     */
    authFactory.isAuthenticated = function() {
      var token = this.getStoredToken();
      if(token) {
        var params = this.parseJWT(token);
        if (Math.round(new Date().getTime() / 1000) <= params.exp) {
          this.setUserData(token);
          return true;
        }
      } else {
          return false;
      }
    };
    /**
     * Return this private user data
     */
    authFactory.getUserData = function() {
     if(Object.keys(user).length){
        return user;
     } else {
        this.setUserData();
        return this.getUserData();
     }
    };
    /**
     * Set data for the current user
     */
    authFactory.setUserData = function(token) {
      if(!token){
        var token = this.getStoredToken();
      }
      var parsedJWT = this.parseJWT(token);
      user.name = parsedJWT.name;
      user.id = parsedJWT.sub;
      user.hasPermission = parsedJWT.role;
      user.welcome = true;
    };
    /**
     * Mark home page as visited after login
     */
    authFactory.markVisited = function() {
      user.welcome = false;
    }
    /**
     * Request JSON Web Token from server
     */
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
    /**
     * Return the JWT from local storage
     */
    authFactory.getStoredToken = function() {
      return localStorage.getItem('betterTradingToken');
    };
    /**
     * Parse the JWT to get values from it
     */
    authFactory.parseJWT = function(token) {
      var base64Url = token.split('.')[1];
      var base64 = base64Url.replace('-', '+').replace('_', '/');
      return JSON.parse($window.atob(base64));
    };
    return authFactory;
}]);
