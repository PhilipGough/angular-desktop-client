'use strict';
angular.module('BetterBetting.home', [])
.config(function($stateProvider){
  $stateProvider.state('preAuth.home', {
    url: '/',
    data : { title: 'Home' },
    views: {
      'layoutMainContent': {
        controller: 'HomeCtrl',
        templateUrl: 'partials/preAuth/home.tpl.html'
      }
    }
  });
})

.controller('HomeCtrl', ['$scope', function($scope) {
    $scope.horse =  'assets/image/horse.jpg';
  }
]);
