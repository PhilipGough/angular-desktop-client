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

.controller('RegisterCtrl', ['$scope', 'RegistrationFactory', 'Flash', 'authFactory', '$state',
                          function($scope, RegistrationFactory, Flash, authFactory, $state) {

  $scope.user = {};
  $scope.user.pundit = false;

  /**
   * Route user to correct state based on value in JWT
   */
  function routeUser(userData) {
    if(userData.hasPermission === 'True' || userData.hasPermission === true){
      $state.go('pundit.dashboard');
    }
    else {
      $state.go('user.home');
    }
  }
  /**
   * Register these user details and store token if success
   * Print error message if this request fails
   */
  function register(user) {
    if(user.password === user.password2){
        $scope.dataLoading = true;
        RegistrationFactory.userRegistration(user)
        .success(function(response) {
          console.log(response);
           authFactory.getAuthToken(user.email, user.password)
            .success(function(response) {
              localStorage.setItem('betterTradingToken', response);
              authFactory.setUserData(response);
              routeUser(authFactory.getUserData());
            }, function(error){
              var message = '<strong>Registration failed!</strong> Authentication issue ';
              Flash.create('danger', message, 'custom-class');
            });
      })
      .error(function(response, status) {
        var message = '<strong>Registration failed!</strong> ' + response.error_message;
        Flash.create('danger', message, 'custom-class');
        console.log('The request failed with response - ' + response.error_message + 'and status code ' + status);
        $scope.dataLoading = false;
      });

    }  else {
        var message = '<strong>Registration Failed!</strong> Passwords do not match';
        Flash.create('danger', message, 'custom-class');

      }
  }

  $scope.register = register;


}])
/**
 * Factor to handle user registration
 */
.factory('RegistrationFactory', ['$http', '$rootScope',
                function($http, $rootScope) {

  var regFactory = {};

  regFactory.userRegistration = function(user) {
    return $http({
          method: 'post',
          url: $rootScope.baseURL +'user',
          contentType: 'application/json',
          data: {
              firstname: user.firstName,
              lastname: user.lastName,
              username: user.username,
              email: user.email,
              password: user.password,
              password_two: user.password2,
              pundit: user.pundit
          }
     });
  };

    return regFactory;
}]);




