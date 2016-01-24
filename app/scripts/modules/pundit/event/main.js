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

.controller('PunditEventCtrl', ['$scope', 'betfairFactory', 'eventFactory', 'Flash',
                    function($scope, betfairFactory, eventFactory, Flash) {
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
})();

  betfairFactory.callAPI('eventList').then(function(data) {
    vm.sportGenres = data
    vm.sportsList = true;
    vm.listReady = true;
  },function(error) {
      var message = '<strong>Error!</strong> Cannot retrieve data at this time';
      Flash.create('danger', message, 'custom-class');
  });

   $scope.$watch(function watchSelectedSport( scope ) {
      return( vm.selectedSport );
    },  function handleSportChange( newValue, oldValue ) {
        if(angular.isDefined(newValue) && newValue !== null){
           eventFactory.setSportGenre(newValue);
           if(newValue.eventType.name == 'Soccer') {
              betfairFactory.callAPI('competitionList')
              .then(function(data) {
                  vm.footBallCompetitions = data
                  vm.showVenue = null;
                  vm.showCompList = true;
                  vm.showVenueList = false;
                  vm.apiReady = true;

                },function(error) {
                  var message = '<strong>Error!</strong> Cannot retrieve data at this time';
                  Flash.create('danger', message, 'custom-class');
            });
           } else {
            betfairFactory.callAPI('venues')
              .then(function(data) {
                  vm.racingVenues = data
                  //eventFactory.setRacingVenue(data);
                  vm.selectedComp = null;
                  vm.showCompList = false;
                  vm.showVenueList = true;
                  vm.apiReady = true;
                },function(error) {
                  var message = '<strong>Error!</strong> Cannot retrieve data at this time';
                  Flash.create('danger', message, 'custom-class');
                  console.log('The request failed with response ' + error );
            });
           }
        }
      }
    );

  vm.setDates = function() {
      var yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      yesterday.setTime(yesterday.getTime()-yesterday.getHours()*3600*1000-yesterday.getMinutes()*60*1000);
      vm.afterDate = yesterday;
      vm.minDate  = yesterday;
      var nextweek = new Date(vm.beforeDate.getFullYear(), vm.beforeDate.getMonth(), vm.beforeDate.getDate()+7);
      vm.beforeDate = nextweek;
    }

  vm.initilaiseCalenders = function() {
    vm.afterDate = new Date();
    vm.minDate = new Date();
    vm.format = 'dd-MMMM-yyyy';
    vm.afterTime = new Date();
    vm.hstep = 1;
    vm.mstep = 15;
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
      eventFactory.setAfterTimeDate(vm.afterDate, vm.afterTime)
    } else {
        this.beforeDateSet = true;
        eventFactory.setBeforeTimeDate(vm.beforeDate, vm.beforeTime)
    }
  }

  vm.open = function($event, calender) {
    if(calender === 1){
      vm.status.opened = true;
    } else {
      vm.status.openedTwo = true;
    }
  };

  vm.continue = function() {
     if(! vm.afterDateSet){
        eventFactory.setAfterTimeDate(vm.afterDate, vm.afterTime)
    }
    if(! vm.beforeDateSet){
       eventFactory.setBeforeTimeDate(vm.beforeDate, vm.beforeTime)
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
      console.log(data);
      if(1 > data.length) {
        console.log('You made it son')
      }
    }, function(error) {
          var message = '<strong>Error!</strong> Cannot retrieve data at this time';
          Flash.create('danger', message, 'custom-class');
    });
  }
}]);
