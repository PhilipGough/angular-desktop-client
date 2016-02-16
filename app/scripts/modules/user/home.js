/**
 * Module which handles a normal user
 */
'use strict';
angular.module('BetterBetting.user', [])
.config(function($stateProvider){
  $stateProvider.state('user.home', {
    url: '/home',
    data : {
      title: 'Home'
    },
    views: {
      'layoutMainContent': {
        controller: 'UserMainCtrl',
        controllerAs: 'vm',
        templateUrl: 'partials/user/home.tpl.html'
      }
    }
  });
})
/**
 * Controller to alter the width of the sidebar
 */
.controller('UserHomeCtrl', ['$scope', '$document',
                                     function($scope, $document) {
    $scope.toggle = true;

    $scope.toggleSidebar = function() {
        $scope.toggle = !$scope.toggle;
    };


}])
/**
 * Main controller on homepage. Handles pagination and GET request to the API
 * for a list of pundits
 */
.controller('UserMainCtrl', ['restFactory', '$state',function(restFactory, $state) {
  var vm = this;
          restFactory.makeGetRequest('pundit')
            .then(function(data){
            vm.pundits = (data) ;
          });

  vm.paginationController = function() {

  /**
   * Fetch an instance of a pundit based on id and
   * navigate to that pundits profile
   * @param  {int} pundit_id - The id of the pundit selected
   */
  vm.getPundit = function(pundit_id){
    console.log(pundit_id)
    console.log(typeof(pundit_id))

    $state.go('user.punditProfile/'+pundit_id);
      restFactory.makeGetRequest('pundit/'+pundit_id)
            .then(function(data){
              console.log(data);
            })
  }
};

}]);
