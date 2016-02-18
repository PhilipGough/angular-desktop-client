/**
 * Module for a pundits event main page. Includes the ability for a pundit
 * to generate an event by stepping through a wizard making json-rpc calls
 * to an external API for live data
 */
'use strict';
angular.module('BetterBetting.pundit.event', [])
.config(function($stateProvider){
  $stateProvider.state('pundit.event', {
    url: '/event',
    data : { title: 'Events' },
    views: {
      'layoutMainContent': {
        controller: 'PunditEventCtrl',
        templateUrl: 'partials/pundit/event/main.tpl.html'
      }
    }
  });
})
/**
 * Controller for this pundit view.
 */
.controller('PunditEventCtrl', ['$scope','betfairFactory', 'eventFactory', 'Flash', '$state', '$timeout',
                    function($scope, betfairFactory, eventFactory, Flash, $state, $timeout) {
  var vm = this;
  (function init() {
  vm.listReady = false;
  vm.sportGenres;
  vm.sportsList = false;
  vm.selectedSport = null;
  vm.selectedComp = null;
  vm.selectedVenues = [];
  vm.afterDateSet = false;
  vm.beforeDateSet = false;
  vm.apiReady = false;
  vm.textQuery = '';
  vm.loading = true;
})();

  /**
   *  Call third party API for a list of current events to populate
   *  dropdown menu
   * @return {String} - Returns a JSON string of data containing current events if success
   * If error, display flash warning message to end user
   */
  betfairFactory.callAPI('eventList').then(function(data) {
    vm.sportGenres = data;
    vm.sportsList = true;
    $timeout(function() {
        vm.listReady = true;
        vm.loading = false;
    }, 1500);
  },function() {
      vm.loading = false;
      var message = '<strong>Error!</strong> Cannot retrieve data at this time';
      Flash.create('danger', message, 'custom-class');
  });
  /**
   * Function which watches for changes to value in dropdown menu an make
   * appropriate HTTP request to reflect this change as needed.
   */
   $scope.$watch(function watchSelectedSport() {
      return( vm.selectedSport );
    },  function handleSportChange( newValue ) {
        if(angular.isDefined(newValue) && newValue !== null){
           eventFactory.setSportGenre(newValue);
           if(newValue.eventType.name === 'Soccer') {

              //Get a list of current competitions if value becomes football
              betfairFactory.callAPI('competitionList')
              .then(function(data) {
                  vm.footBallCompetitions = data;
                  vm.showVenue = null;
                  vm.showCompList = true;
                  vm.showVenueList = false;
                  vm.apiReady = true;

                },function() {
                  var message = '<strong>Error!</strong> Cannot retrieve data at this time';
                  Flash.create('danger', message, 'custom-class');
            });
           } else {
            //Get a list of racing venues if value becomes racing
            betfairFactory.callAPI('venues')
              .then(function(data) {
                  vm.racingVenues = data;
                  vm.selectedComp = null;
                  vm.showCompList = false;
                  vm.showVenueList = true;
                  vm.apiReady = true;
                },function() {
                  var message = '<strong>Error!</strong> Cannot retrieve data at this time';
                  Flash.create('danger', message, 'custom-class');
            });
           }
        }
      }
    );
   /**
    * Define correct dates for calender picker in wizard
    */
  vm.setDates = function() {
      vm.afterDate = new Date();
      vm.minDate  = new Date();
      var nextweek = new Date(vm.beforeDate.getFullYear(), vm.beforeDate.getMonth(), vm.beforeDate.getDate()+7);
      vm.beforeDate = nextweek;
    };
  /*
   * Initialise the calender with the calculated data
   */
  vm.initilaiseCalenders = function() {
    vm.afterDate = new Date();
    vm.minDate = new Date();
    vm.format = 'dd-MMMM-yyyy';
    vm.afterTime = new Date();
    vm.status = {
      opened: false,
      openedTwo: false
    };
    vm.beforeDate = new Date();
    vm.beforeTime = new Date();
    this.setDates();
  };

  vm.initilaiseCalenders();

  // Function to reset calender
  vm.clear = function () {
    vm.afterDate = null;
  };
  /*
   * Function bound to the view with an ng-change directive
   * Called after a time change and will use the service
   * to alter makret filter for final POST request
   */
  vm.afterTimeChange = function (calenderRef) {
    if(calenderRef === 1){
      this.afterDateSet = true;
      eventFactory.setAfterTimeDate(vm.afterDate, vm.afterTime);
    } else {
        this.beforeDateSet = true;
        eventFactory.setBeforeTimeDate(vm.beforeDate, vm.beforeTime);
    }
  };
  /*
   * Function to open the calender with a click
   */
  vm.open = function($event, calender) {
    if(calender === 1){
      vm.status.opened = true;
    } else {
      vm.status.openedTwo = true;
    }
  };
  /**
   * This function will use the data generated in this section of the wizard which
   * has been sorted by the service to generate and display the results from Betfair API
   */
  vm.continue = function() {
     if(! vm.afterDateSet){
        eventFactory.setAfterTimeDate(vm.afterDate, vm.afterTime);
    }
    if(! vm.beforeDateSet){
       eventFactory.setBeforeTimeDate(vm.beforeDate, vm.beforeTime);
     }
     if(vm.selectedSport.eventType.name === 'Soccer') {
        eventFactory.setTextQuery(vm.textQuery);
        if(vm.selectedComp){
          eventFactory.setCompetition(vm.selectedComp);
        }
     } else {
        if(vm.selectedVenues){
          eventFactory.setRacingVenue(vm.selectedVenues);
        }
     }
    var payload = eventFactory.getMarketFilter();
    betfairFactory.callAPIPost('events', payload)
    .then(function(data) {
      if(1 > data.length) {
       var message = 'No events match the information you have provided';
          Flash.create('danger', message, 'custom-class');
      }
      else {
        eventFactory.setResultsSet(data);
        $state.go('pundit.selection');
      }
    }, function() {
          var message = '<strong>Error!</strong> Cannot retrieve data at this time';
          Flash.create('danger', message, 'custom-class');
    });
  };
}]);
