/**
 * Module which handles a normal user
 */
 'use strict';
 angular.module('BetterBetting.user', [])
 .config(function($stateProvider){
  $stateProvider.state('user.home', {
    url: '/home',
    data : {
      title: 'Home',
      css: ['bower_components/rdash-ui/dist/css/pundit.min.css',
      'bower_components/rdash-ui/dist/css/rdash.min.css']
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
 .controller('UserHomeCtrl', ['$scope', '$state', function($scope, $state) {
    $scope.toggle = true;
    $scope.toggleSidebar = function() {
        $scope.toggle = !$scope.toggle;
    };
    $scope.logout = function() {
      localStorage.removeItem('betterTradingToken');
      $state.go('preAuth.home');
    };
}])

/**
 * Main controller on homepage. Handles pagination and GET request to the API
 * for a list of pundits
 */
 .controller('UserMainCtrl', ['restFactory', function(restFactory) {
    var vm = this;
    vm.dataReady = false;
    vm.alerts = [];

    vm.addAlert = function(msg, type) {
      vm.alerts.push({type: type, msg: msg});
    };

    vm.closeAlert = function(index) {
      vm.alerts.splice(index, 1);
    };

  /*
   * Return a list of events published to this user
   */
   restFactory.makeGetRequest('event')
   .then(function(data){
      var allData = data;
      var pendingResults = [];
      // Mark which events havent run yet
      angular.forEach(data, function(event){
        if(event.state === 'Pending') {
          pendingResults.push(event);
        }
      });
      // Use the result to generate alerts
      if(pendingResults.length > 0){
        vm.addAlert('You have '+ pendingResults.length.toString()+ ' active events pending', 'success');
      } else {
        vm.addAlert('There are no pending events!', 'danger');
      }
      vm.fltrEvents = pendingResults;
      // Hit the Redis server to find which of these events havent been seen before
      restFactory.makeGetRequest('events/unseen')
        .then(function(data){
            vm.unseenEventIds = data;
            vm.unseenEventFeed = [];
            // Mark the events that have not been seen before
            angular.forEach(vm.unseenEventIds, function(event){
              for(var i=0 ; i < allData.length ; i++){
                if(allData[i].id === parseInt(event)) {
                  vm.unseenEventFeed.push(allData[i]);
                  continue;
                }
              }
            });
            if(vm.unseenEventFeed.length > 0) {
                vm.addAlert('You have received '+ vm.unseenEventFeed.length.toString()+ ' new events since your last visit', 'success');
            } else {
                  vm.addAlert('No events have been published since your last visit!', 'danger');
            }
            // Send the required data to the directive
            vm.requiredData = {
              all: allData,
              filtered: pendingResults
            };
            vm.dataReady = true;
        });
  }, function() {
    // HTTP Request to server has failed
       vm.addAlert('There was a problem accessing data!', 'danger');
  });

}]);
