'use strict';
angular.module('BetterBetting')

.controller('PendingEventController', [ '$modal', function($modal){

   var vm = this;

   /**
   * Allows user to click an area of chart
   * @param  {event} event - Mouse click event
   */
   vm.fltrEvents = vm.eventData.filtered;
   vm.show = function(event) {

    for(var i = 0 ; i < vm.eventData.all.length ; i++) {
        if(vm.eventData.all[i].id === event.id) {
            var requiredData = vm.eventData.all[i];
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

   vm.pageController = function(){

  };

}]);
