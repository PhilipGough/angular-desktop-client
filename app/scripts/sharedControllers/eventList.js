'use strict';
angular.module('BetterBetting')

.controller('EventListCtrl',['eventsAtDate', '$filter', '$modal',
                              function(eventsAtDate, $filter, $modal){


  var vm = this;
  vm.unfilteredEvents = eventsAtDate;
  vm.events = (eventsAtDate);
  vm.show = function(eventId) {
    var requiredEvent = null;
    for(var i = 0 ; i < vm.unfilteredEvents.length ; i++){
      if(vm.unfilteredEvents[i].id === eventId) {
        requiredEvent = vm.unfilteredEvents[i];
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
            return requiredEvent;
           }
      }
    });
  };


}]);
