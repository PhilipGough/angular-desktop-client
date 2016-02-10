/**
 * Module which handles the landing page for a pundit type user
 */
'use strict';
angular.module('BetterBetting.pundit', [])
.config(function($stateProvider){
  $stateProvider.state('pundit.dashboard', {
    url: '/dashboard',
    data : {
      title: 'Dashboard'
    },
    views: {
      'layoutMainContent': {
        controller: 'PunditDashboardCtrl',
        controllerAs: 'vm',
        templateUrl: 'partials/pundit/dashboard.tpl.html'
      }
    },
    resolve: {
        getPublishedEvents : function(restFactory) {
            return restFactory.makeGetRequest('event');
        },
         getPunditRating : function(restFactory) {
            return restFactory.makeGetRequest('user')
        }
    }
  });
})
/**
 * Alter the css class and toggle sidebar function
 */
.controller('PunditHomeCtrl', ['$scope', '$document',
                                     function($scope, $document) {
    $scope.toggle = true;
    $document.find('body')[0].id = 'pundit';

    $scope.toggleSidebar = function() {
        $scope.toggle = !$scope.toggle;
    };


}])
/**
 * Main controller for this view. Filter events into well formatted objects.
 * Display modal for a pundit when clicked by user in the list
 */
.controller('PunditDashboardCtrl', ['$scope', '$modal', 'getPublishedEvents', '$filter', 'getPunditRating',
                                     function($scope, $modal, getPublishedEvents, $filter, getPunditRating) {
   var vm = this;
   vm.punditEvents = getPublishedEvents;
   vm.userRating = getPunditRating.rating;
   vm.fltrEvents = $filter('publishedEvenFilter')(vm.punditEvents);

   vm.show = function(event) {

    for(var i = 0 ; i < vm.punditEvents.length ; i++) {
        if(vm.punditEvents[i].id === event.id) {
            var requiredData = vm.punditEvents[i];
            break;
        }
    }

      $modal.open({
      animation: true,
      templateUrl: 'partials/modals/eventDetailed.html',
      controller: ['$modalInstance', 'requiredData', EventModalCtrl],
      controllerAs: 'vm',
      size: 'lg',
      resolve: {
        requiredData: function () { return requiredData}
      }
    });
   }
   /**
    * Controls the modal for this event when event is clicked by user
    */
    function EventModalCtrl($modalInstance, requiredData) {
      var vm = this;
      vm.data = requiredData;
      if(vm.data.runnerdata.Colors){
          vm.data.colorSrc = vm.data.runnerdata.Colors;
          delete vm.data.runnerdata.Colors;
      }
      if(vm.data.state === 'Winner') {
        vm.alerts = [{
            type: 'success',
            msg: 'Winning bet! Total profit of ' + vm.data.adjustment + ' points !'}]
      }
      else if (vm.data.state === 'Loser') {
        vm.alerts = [{
            type: 'danger',
            msg: 'Losing bet! Negative adjustment of ' + vm.data.adjustment + ' points !'}]
      } else {
        vm.alerts = [{
            type: 'info',
            msg: 'Result Pending! No results yet for this event!'}]
      }

      $modalInstance.close();

      vm.closeAlert = function(index) {
        vm.alerts.splice(index, 1);
    };
     };

}])
/**
 * Controller to handle, generate and delete alerts
 * Will display a welcome alert at each successful login
 */
.controller('AlertsCtrl', ['$scope', 'authFactory',
                                function($scope, authFactory) {

    $scope.alerts = [];
    var user = authFactory.getUserData();
    if( Object.keys(user).length > 0 && user.welcome){

        var msg = {
                type: 'success',
                msg: 'Welcome ' + user.name
            };
        $scope.alerts.push(msg);
        authFactory.markVisited();
    };


    $scope.addAlert = function() {
        $scope.alerts.push({
            msg: 'Another alert!'
        });
    };

    $scope.closeAlert = function(index) {
        $scope.alerts.splice(index, 1);
    };
  }
]);
