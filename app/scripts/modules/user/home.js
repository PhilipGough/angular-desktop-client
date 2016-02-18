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
 .controller('UserHomeCtrl', ['$scope', '$document', function($scope, $document) {
    $scope.toggle = true;
    $scope.toggleSidebar = function() {
        $scope.toggle = !$scope.toggle;
    };
}])

/**
 * Main controller on homepage. Handles pagination and GET request to the API
 * for a list of pundits
 */
 .controller('UserMainCtrl', ['restFactory', '$state', '$modal', '$filter',
                    function(restFactory, $state, $modal, $filter) {
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
    angular.forEach(data, function(event){
      if(event.state === 'Pending') {
        pendingResults.push(event);
      }
    });
    if(pendingResults.length > 0){
      vm.addAlert('You have '+ pendingResults.length.toString()+ ' active events pending', 'success');
    } else {
      vm.addAlert('There are no pending events!', 'danger');
    }
    vm.fltrEvents = $filter('publishedEvenFilter')(pendingResults);


    restFactory.makeGetRequest('events/unseen')
    .then(function(data){
      vm.unseenEventIds = data;
      vm.unseenEventFeed = [];
      angular.forEach(vm.unseenEventIds, function(event){
        console.log(event);
        for(var i=0 ; i < allData.length ; i++){
          if(allData[i].id === parseInt(event)) {
            vm.unseenEventFeed.push(allData[i]);
            continue;
          }
        }
      })
      if(vm.unseenEventFeed.length > 0){
        vm.addAlert('You have received '+ vm.unseenEventFeed.length.toString()+ ' new events since your last visit', 'success');
      } else {
        vm.addAlert('No events have been published since your last visit!', 'danger');
      }
      vm.requiredData = {
        all: allData,
        filtered: vm.fltrEvents
      };
      vm.dataReady = true;
    });
  });

}]);
