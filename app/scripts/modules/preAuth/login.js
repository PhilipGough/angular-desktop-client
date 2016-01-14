'use strict';
angular.module('BetterBetting.login', [])
.config(function($stateProvider){
  $stateProvider
    .state('preAuth.pagetwo', {
      url: '/pagetwo',
      data : { title: 'Login' },
      views: {
        'layoutMainContent': {
          controller: 'LoginCtrl',
          templateUrl: 'partials/preAuth/login.tpl.html'
        }
      }
    });
})

.controller('LoginCtrl', [ '$scope', 'Flash', 'authFactory',
  function($scope, Flash, authFactory){

  $scope.login = function(user) {
    authFactory.getAuthToken(user.email, user.password)

    .success(function(response) {
        localStorage.setItem('betterTradingToken', response);
        authFactory.setUserData(response);
        console.log(authFactory.getUserData());
    })
    .error(function(response, status) {
      var message = '<strong>Login Failed!</strong> Username or password incorrect';
      Flash.create('danger', message, 'custom-class');
      console.log('The request failed with response ' + response + 'and status code ' + status);
    });
  };

  $scope.user = {
    email:  '',
    password: ''
  };


}]);


