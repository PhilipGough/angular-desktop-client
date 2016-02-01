'use strict';
angular.module('BetterBetting.pundit.createEvent', [])
.config(function($stateProvider){
  $stateProvider.state('pundit.createEvent', {
    url: '/event/create',
    data : { title: 'Create Event' },
    views: {
      'layoutMainContent': {
        controller: 'EventCreationCtrl',
        templateUrl: 'partials/pundit/event/create.tpl.html'
      }
    }
  });
})

.controller('EventCreationCtrl', ['eventFactory', 'betfairFactory', '$filter', '$modal',
                                     function(eventFactory, betfairFactory, $filter, $modal) {
    var vm = this;
    vm.marketList = eventFactory.getMarketCatalogueData();
    vm.betType = ['Back','Lay'];
    var list = []
    list = $filter('range')(list,0,6);
    vm.stakeValue = list

    vm.getMarketPriceData = function() {
      var priceDataPayload = eventFactory.setMarketBookPayload(vm.selectedMarket.marketId);
      betfairFactory.callAPIPost('market/book', priceDataPayload)
      .then( function(data) {
        vm.marketBook = data[0];
      }), function() {

      };
    };

    vm.getRunnerPriceData = function() {
      var runner = null;
      for(var i = 0 ; i < vm.marketBook.runners.length ; i++) {
        if(vm.marketBook.runners[i].selectionId === vm.selectedResult.selectionId) {
          runner = vm.marketBook.runners[i];
          break;
        }
      }
      this.setSelectionPriceData(runner);
    };

    vm.setSelectionPriceData = function(runner) {

      var priceObj = {};
      var exchangePriceBack = 'N/a';
      var exchangePriceLay = 'N/a';
      if(runner.ex.availableToBack) {
        exchangePriceBack = runner.ex.availableToBack[0].price;
      }
      if(runner.ex.availableToLay) {
        exchangePriceLay = runner.ex.availableToLay[0].price;
      }
      priceObj['Current ex. price'] = exchangePriceBack;
      priceObj['Current lay price'] = exchangePriceLay;
      vm.priceData = priceObj;
    };

    vm.continue = function() {
      var requiredData = eventFactory.buildPublishEvent(vm);
      $modal.open({
      animation: true,
      templateUrl: 'partials/modals/eventModal.html',
      controller: ['$modalInstance', 'requiredData', EventModalCtrl],
      controllerAs: 'vm',
      size: 'lg',
      resolve: {
        requiredData: function () { return requiredData}
      }
    });
  }

    function EventModalCtrl($modalInstance, requiredData) {
      var vm = this;
      vm.data = requiredData;

      vm.publishEvent = function() {
        console.log(vm.data);
        betfairFactory.callAPIPost('post', vm.data)
        .then(function(data) {
          console.log(data);
        }), function(data) {
          console.log(data);
        }
        $modalInstance.close();
     }
}

}]);
