angular.module('BetterBetting.pundit')

.factory('eventFactory', ['$http', '$rootScope', function($http, $rootScope) {

  var eventService = {};
  eventService.marketFilter = {};
  filter = eventService.marketFilter.fitler = {};
  mst = filter.marketStartTime = {};

  eventService.setSportGenre = function(input) {
    filter.eventTypeIds = [];
    filter.eventTypeIds.push(input.eventType.id);
  }

  eventService.setCompetition = function(input) {
    filter.competitionIds = [];
    filter.competitionIds.push(input.competition.id);
  }

  eventService.setRacingVenue = function(input) {
    filter.venues = [];
    for (var i = 0 ; i < input.length ; i++){
        filter.venues.push(input[i].venue);
    }
  }

  eventService.setTextQuery = function(text) {
    filter.textQuery = text;
  }

  eventService.setAfterTimeDate = function(date, time) {
    if(date != null){
      mst.from = this.dateConverter(date, time);
    } else {
      mst.from = '';
    }
  }

  eventService.setBeforeTimeDate = function(date, time) {
    if(date != null){
      mst.to = this.dateConverter(date, time);
    } else {
      mst.to= '';
    }
  }

  eventService.dateConverter = function(date, time) {
    console.log(date,time)
    date.setHours(time.getHours());
    date.setMinutes(time.getMinutes());
    date.setSeconds(time.getSeconds());
    return date.toJSON();
  }

  eventService.getMarketFilter = function() {
    filter.marketCountries = ['GB', 'IE', 'ES'];
    return angular.toJson(filter);
  }

  return eventService;
}]);
