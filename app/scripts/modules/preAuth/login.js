'use strict';
angular.module('BetterBetting.login', [])
.config(function($stateProvider){
  $stateProvider
    .state('preAuth.login', {
      url: '/login',
      data : { title: 'Login' },
      views: {
        'layoutMainContent': {
          controller: 'LoginCtrl',
          templateUrl: 'partials/preAuth/login.tpl.html'
        }
      }
    });
})

.controller('LoginCtrl', [ '$scope', 'Flash', 'authFactory', '$state',
  function($scope, Flash, authFactory, $state){

  /*
   * Route user to correct app based on permission
   */
  function routeUser(userData) {
    if(userData.hasPermission === 'True'){
      $state.go('pundit.dashboard');
    }
    else {
      $state.go('user.home');
    }
  }

  /**
    * Request a JSON Web Token from the API and store in local storage
    */
  $scope.login = function(user) {
    authFactory.getAuthToken(user.email, user.password)
    .success(function(response) {
        localStorage.setItem('betterTradingToken', response);
        authFactory.setUserData(response);
        routeUser(authFactory.getUserData());
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


