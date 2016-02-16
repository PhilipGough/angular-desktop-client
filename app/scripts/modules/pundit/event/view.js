/**
 * Module for a pundits event main page. Includes the ability for a pundit
 * to generate an event by stepping through a wizard making json-rpc calls
 * to an external API for live data
 */
'use strict';
angular.module('BetterBetting.pundit.viewEventList', [])
.config(function($stateProvider){
  $stateProvider.state('pundit.viewEvent', {
    url: '/event/view',
    data : { title: 'Events' },
    views: {
      'layoutMainContent': {
        controller: 'PunditEventViewCtrl',
        templateUrl: 'partials/pundit/event/view.tpl.html'
      }
    }
  });
})

.controller('PunditEventViewCtrl', ['eventFactory', '$modal', '$state', '$filter','restFactory',
                    function(eventFactory, $modal, $state, $filter, restFactory) {

 var vm = this;
 vm.punditEvents = eventFactory.getPunditEventList();
 if(vm.punditEvents.length === 0) {
      restFactory.makeGetRequest('event').then(function(data){
        vm.punditEvents = data;
         vm.fltrEvents = $filter('publishedEvenFilter')(vm.punditEvents);
      })
 } else {
   vm.fltrEvents = $filter('publishedEvenFilter')(vm.punditEvents);
 }

  /**
   * Allows user to click an area of chart
   * @param  {event} event - Mouse click event
   */
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
   };


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

 vm.pageController = function(){

};



}]);
