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
    },
    resolve : {
       getAuthStatus : function(authFactory, $state, $q, $timeout) {
            var authStatus = authFactory.isAuthenticated();
            if(authStatus) {
              var user = authFactory.getUserData();
              console.log(user)
              if(user.hasPermission === 'True' || user.hasPermission === true){
                 $timeout(function() {
                    $state.go('pundit.dashboard');
                  },0);
                 return $q.reject();
              }
              else {
                $timeout(function() {
                    $state.go('user.home');
                  },0);
                return $q.reject();
              }
            }
        }
    }
  });
})

.controller('HomeCtrl', ['$scope', function($scope) {

    $scope.horse =  'assets/image/horse.jpg';
  }
]);
