'use strict';
angular.module('BetterBetting.register', [])
.config(function($stateProvider){
  $stateProvider.state('preAuth.register', {
    url: '/register',
    views: {
      'layoutMainContent': {
        controller: 'RegisterCtrl',
        templateUrl: 'partials/preAuth/register.tpl.html'
      }
    }
  });
})

.controller('RegisterCtrl', ['$scope', function($scope) {
      var vm = this;
  }
])

.factory('RegistrationFactory', ['$http', '$rootScope',
                function($http, $rootScope) {

  var regFactory = {};

  regFactory.userRegistration = function() {
    return $http({
          method: 'post',
          url: $rootScope.baseURL +'user',
          contentType: 'application/json',
          data: {
              email: email,
              password: password
          }
      });
  };





}]);
