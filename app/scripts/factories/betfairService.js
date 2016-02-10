/**
 * This module handles HTTP requests
 * The request are basic but are seperated out to future proof
 * any potential changes
 */
'use strict';
angular.module('BetterBetting.pundit')

.factory('betfairFactory', ['$http', '$rootScope', 'authFactory', '$state',
                  function($http, $rootScope, authFactory, $state) {

  var betfairClient = {};

  betfairClient.callAPI = function(endpoint) {
    return $http({
      method: 'get',
      headers : {'Authorization': authFactory.getStoredToken()},
      url: $rootScope.baseURL + endpoint,
      contentType: 'application/json'
    })
    .then(function(response) {
      return response.data;
    }, function(error){
          if(error.status === 401){
            $state.go('preAuth.home')
          }
        }
  )};


  betfairClient.callAPIPost = function(endpoint, payload) {
    return $http({
      method: 'post',
      headers : {'Authorization': authFactory.getStoredToken()},
      url: $rootScope.baseURL + endpoint,
      contentType: 'application/json',
      data: payload
    })
    .then(function(response) {
      return response.data;
    },
      function(error) {
        if(error.status === 401){
            $state.go('preAuth.home')
          }
        console.log(error, error.status)
    });
  };

  return betfairClient;
}])


.factory('restFactory', ['$http', '$rootScope', 'authFactory', '$state',
                function($http, $rootScope, authFactory, $state) {

  var restFactory = {};

  restFactory.makeGetRequest = function(endpoint) {

    var jwt = authFactory.getStoredToken();
    if (jwt){
      return $http({
        method: 'get',
        headers : {'Authorization': jwt},
        url: $rootScope.baseURL + endpoint,
        contentType: 'application/json'
      })
      .then(function(response) {
          return response.data;

      }, function(error){
          if(error.status === 401){
            $state.go('preAuth.home')
          }
        }
    )};
  };

  restFactory.makePOSTrequest = function(endpoint, payload) {
    return $http({
      method: 'post',
      headers : {'Authorization': authFactory.getStoredToken()},
      url: $rootScope.baseURL + endpoint,
      contentType: 'application/json',
      data: payload
    })
    .then(function(response) {
      return response.data;
    },
      function(error) {
        return(error, error.status)
      });
  };

  return restFactory;
}]);
