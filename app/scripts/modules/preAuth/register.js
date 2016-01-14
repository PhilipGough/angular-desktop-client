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

.controller('RegisterCtrl', ['$scope', '$http', '$log',
            function($scope, $http, $log) {

    var vm = this;
  }
]);
