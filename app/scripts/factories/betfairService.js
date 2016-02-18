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
        $state.go('preAuth.home');
      }
    });
  };


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
        $state.go('preAuth.home');
      }
      console.log(error, error.status);
    });
  };

  return betfairClient;
}])


 .factory('restFactory', ['$http', '$rootScope', 'authFactory',
          function($http, $rootScope, authFactory) {

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
        console.log(error.status);
        return(error, error.status);
      });
    }
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
      return(error, error.status);
    });
  };


  restFactory.makeDeleteRequest = function(endpoint) {
    return $http({
      method: 'delete',
      headers : {'Authorization': authFactory.getStoredToken()},
      url: $rootScope.baseURL + endpoint,
      contentType: 'application/json'
    })
    .then(function(response) {
      return response.data;
    },
    function(error) {
      return(error, error.status);
    });
  };


  restFactory.tryThis = function() {
    return     function EventModalCtrl($modalInstance, requiredData) {
      var vm = this;
      vm.data = requiredData;
      if(vm.data.runnerdata.Colors){
        vm.data.colorSrc = vm.data.runnerdata.Colors;
        delete vm.data.runnerdata.Colors;
      }
      if(vm.data.state === 'Winner') {
        vm.alerts = [{
          type: 'success',
          msg: 'Winning bet! Total profit of ' + vm.data.adjustment + ' points !'}];
        }
        else if (vm.data.state === 'Loser') {
          vm.alerts = [{
            type: 'danger',
            msg: 'Losing bet! Negative adjustment of ' + vm.data.adjustment + ' points !'}];
          } else {
            vm.alerts = [{
              type: 'info',
              msg: 'Result Pending! No results yet for this event!'}];
            }

            $modalInstance.close();

            vm.closeAlert = function(index) {
              vm.alerts.splice(index, 1);
            };
          };
        };

        return restFactory;
      }]);
