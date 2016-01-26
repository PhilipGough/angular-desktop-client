'use strict';
angular.module('BetterBetting.pundit.selection', [])
.config(function($stateProvider){
  $stateProvider.state('pundit.selection', {
    url: '/event/select',
    data : { title: 'Events' },
    views: {
      'layoutMainContent': {
        controller: 'EventSelectCtrl',
        templateUrl: 'partials/pundit/event/event.tpl.html'
      }
    }
  });
})

.controller('EventSelectCtrl', ['$scope', 'betfairFactory', 'eventFactory', '$state',
                    function($scope, betfairFactory, eventFactory, $state) {

    var vm = this;
    vm.eventList = eventFactory.getResultsSet();
    vm.apiReady = false;

    vm.pollForMarketTypes = function() {
      eventFactory.setEvent(this.selectedEvent);
      console.log(this.selectedEvent);
      betfairFactory.callAPIPost('market',eventFactory.getEventFilter())
      .then(function(data) {
        vm.marketTypes = data
        var obj = angular.fromJson(eventFactory.getMarketFilter())
        if(obj.eventTypeIds[0] === '1'){
          vm.displayOptions = false;
        } else {
          vm.displayOptions = true;
        }
      }), function() {

      };
    };

    vm.continue = function() {

      var payload = '';
      if(vm.selectedMarket){
          payload = eventFactory.getMarketCatalogueFilter(vm.selectedMarket.marketType);
        } else {
          payload = eventFactory.getMarketCatalogueFilter(payload);
        }

      betfairFactory.callAPIPost('market/catalogue', payload)
        .then(function (data) {
          eventFactory.setMarketCatalogueData(data);
          $state.go('pundit.createEvent');
        }), function() {
          console.log('Hi')
        };
    };

}]);
