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

.controller('PunditEventCtrl', ['$scope', 'betfairFactory', 'eventFactory', 'Flash', '$state', '$timeout',
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

   $scope.$watch(function watchSelectedSport( scope ) {
      return( vm.selectedSport );
    },  function handleSportChange( newValue ) {
        if(angular.isDefined(newValue) && newValue !== null){
           eventFactory.setSportGenre(newValue);
           if(newValue.eventType.name === 'Soccer') {
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

  vm.setDates = function() {
      vm.afterDate = new Date();
      vm.minDate  = new Date();
      var nextweek = new Date(vm.beforeDate.getFullYear(), vm.beforeDate.getMonth(), vm.beforeDate.getDate()+7);
      vm.beforeDate = nextweek;
    };

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

  vm.clear = function () {
    vm.afterDate = null;
  };

  vm.afterTimeChange = function (calenderRef) {
    if(calenderRef === 1){
      this.afterDateSet = true;
      eventFactory.setAfterTimeDate(vm.afterDate, vm.afterTime);
    } else {
        this.beforeDateSet = true;
        eventFactory.setBeforeTimeDate(vm.beforeDate, vm.beforeTime);
    }
  };

  vm.open = function($event, calender) {
    if(calender === 1){
      vm.status.opened = true;
    } else {
      vm.status.openedTwo = true;
    }
  };

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
    betfairFactory.callAPIPost('event', payload)
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
