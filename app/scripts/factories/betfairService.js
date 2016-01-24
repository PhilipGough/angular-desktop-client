angular.module('BetterBetting.pundit')

.factory('betfairFactory', ['$http', '$rootScope', function($http, $rootScope) {
  var betfairClient = {};

  betfairClient.callAPI = function(endpoint, params) {

    if(!angular.isDefined(params)) {
      params = {};
    }
    return $http({
      method: 'get',
      url: $rootScope.baseURL + endpoint,
      contentType: 'application/json',
      params: params
    })
    .then(function(response) {
      return response.data;
    });

  }

    betfairClient.callAPIPost = function(endpoint, payload) {
      console.log(payload)
    return $http({
      method: 'post',
      url: $rootScope.baseURL + endpoint,
      contentType: 'application/json',
      data: payload
    })
    .then(function(response) {
      return response.data;
    });

  }

  return betfairClient;
}]);
