/**
 * Module which controls the users section as the view data for a
 * particular pundit.
 */
 'use strict';
 angular.module('BetterBetting.user.eventList', [])
 .config(function($stateProvider){
  $stateProvider.state('user.eventList', {
    url: '/events/list',
    data : { title: 'Event List',
    css: ['bower_components/rdash-ui/dist/css/pundit.min.css',
    'bower_components/rdash-ui/dist/css/rdash.min.css']
  },
  views: {
    'layoutMainContent': {
      controller: 'UserEventListCtrl',
      controllerAs: 'vm',
      templateUrl: 'partials/user/viewEventList.tpl.html'
    }
  }
});
})
 .controller('UserEventListCtrl',[ 'restFactory', '$modal', function(restFactory, $modal){

  var vm = this;
  restFactory.makeGetRequest('event')
  .then(function(response){
    vm.allData = response;
    vm.fltrEvents = (response);
  },function() {

  });

   /**
   * Allows user to click an area of chart
   * @param  {event} event - Mouse click event
   */
   vm.show = function(event) {

    for(var i = 0 ; i < vm.allData.length ; i++) {
      if(vm.allData[i].id === event.id) {
        var requiredData = vm.allData[i];
        break;
      }
    }

    $modal.open({
      animation: true,
      templateUrl: 'partials/modals/eventDetailed.tpl.html',
      controller: 'EventModalCtrl',
      controllerAs: 'vm',
      size: 'lg',
      resolve: {
        requiredData: function () {
          return requiredData;
        }
      }
    });
  };

  vm.paginationController = function(){

  };

}]);
