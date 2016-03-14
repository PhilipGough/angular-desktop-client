/**
 * Module for final stage of event wizard
 */
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

.controller('EventCreationCtrl', ['eventFactory', 'betfairFactory', '$filter', '$modal', '$state',
                                     function(eventFactory, betfairFactory, $filter, $modal, $state) {
    var vm = this;
    vm.marketList = eventFactory.getMarketCatalogueData();
    vm.betType = ['Back','Lay'];
    var list = [];
    list = $filter('range')(list,0,6);
    vm.stakeValue = list;
    /**
     * Make HTTP request for price data on the selection in this event
     * @return {Array} List of objects containing runner data
     */
    vm.getMarketPriceData = function() {
      var priceDataPayload = eventFactory.setMarketBookPayload(vm.selectedMarket.marketId);
      betfairFactory.callAPIPost('market/book', priceDataPayload)
      .then( function(data) {
        vm.marketBook = data[0];
      }, function() {

      });
    };
    /**
     * Iterate through the list of runners to find the selection id
     * @return {obj} - Data for the selection made by the pundit
     */
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

    /**
     * Parse the price data for this runner and create an object
     * to dispaly it
     * @param {obj} runner - The runner in this market
     */
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

   /**
    * Function to create the event and send payload to the API
    */
    function CreateEventModalCtrl($modalInstance, requiredData) {
      var vm = this;
      vm.data = requiredData;
      console.log(vm.data)

      vm.publishEvent = function() {
        betfairFactory.callAPIPost('event', vm.data)
        .then(function(data) {
          $state.go('pundit.dashboard');
        }, function(error) {
          console.log(error);
        });
        $modalInstance.close();
     };
}
    /**
     * Launch a model to allow the user to persist this selection to
     * the database
     * @return {[type]} [description]
     */
    vm.continue = function() {
      var requiredData = eventFactory.buildPublishEvent(vm);
      $modal.open({
      animation: true,
      templateUrl: 'partials/modals/eventModal.html',
      controller: ['$modalInstance', 'requiredData', CreateEventModalCtrl],
      controllerAs: 'vm',
      size: 'lg',
      resolve: {
        requiredData: function () {
            return requiredData;
          }
      }
    });
  };


}]);
