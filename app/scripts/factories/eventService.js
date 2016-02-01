'use strict';
angular.module('BetterBetting.pundit')

.factory('eventFactory', [ '$filter', function($filter) {

  var eventService = {};
  var marketFilter = {};
  var filter = marketFilter.fitler = {};
  var mst = filter.marketStartTime = {};
  var dataSet = [];
  var eventSelected = null;
  var marketCatalogueData = null;

  eventService.setSportGenre = function(input) {
    filter.eventTypeIds = [];
    filter.eventTypeIds.push(input.eventType.id);
  };

  eventService.setCompetition = function(input) {
    filter.competitionIds = [];
    filter.competitionIds.push(input.competition.id);
  };

  eventService.setRacingVenue = function(input) {
    filter.venues = [];
    for (var i = 0 ; i < input.length ; i++){
        filter.venues.push(input[i].venue);
    }
  };

  eventService.setTextQuery = function(text) {
    filter.textQuery = text;
  };

  eventService.setAfterTimeDate = function(date, time) {
    if(date !== null){
      mst.from = this.dateConverter(date, time);
    } else {
      mst.from = '';
    }
  };

  eventService.setBeforeTimeDate = function(date, time) {
    if(date !== null){
      mst.to = this.dateConverter(date, time);
    } else {
      mst.to= '';
    }
  };

  eventService.setResultsSet = function(incomingdataSet) {

    dataSet = incomingdataSet;
  };

  eventService.getResultsSet = function() {
    return dataSet;
  };

  eventService.getEvent = function() {
    return eventSelected;
  };

  eventService.setEvent = function(eventObj) {
    eventSelected = eventObj;
  };

  eventService.getEventFilter = function() {
    var filter = {};
    filter.eventIds = [eventSelected.event.id];
    console.log("HEYHO",angular.toJson(filter));
    return angular.toJson(filter);
  };

  eventService.dateConverter = function(date, time) {
    date.setHours(time.getHours());
    date.setMinutes(time.getMinutes());
    date.setSeconds(time.getSeconds());
    return date.toJSON();
  };

  eventService.getMarketCatalogueFilter = function(marketType){
    var eventTypeId = filter.eventTypeIds;
    var catFilter = {};
    catFilter.eventTypeIds = eventTypeId;
    if( marketType !== ''){
      catFilter.marketTypeCodes = [marketType];
    }
    catFilter.eventIds = [eventSelected.event.id];
    return angular.toJson(catFilter);
  }

  eventService.getMarketCatalogueData = function() {
    return marketCatalogueData;
  };

  eventService.setMarketCatalogueData = function(data) {
    marketCatalogueData = data;
  };

  eventService.getMarketFilter = function() {
    filter.marketCountries = ['GB', 'IE', 'ES'];
    return angular.toJson(filter);
  };


  eventService.buildPublishEvent = function(eventData) {
    var polishedObj = {};
    var eventType = eventData.selectedMarket.eventType.id;
    polishedObj.metaData = [];

    if(eventType === '1') {
      polishedObj.metaData.push({'Competition' : eventData.selectedMarket.competition.name})
    }

    polishedObj.metaData.push({'Selection' : eventData.selectedResult.runnerName})
    polishedObj.metaData.push({ 'Event' : eventData.selectedMarket.event.name})
    polishedObj.metaData.push({'Start Time' : $filter('date')(eventData.selectedMarket.event.openDate, 'd/M/yy h:mm a', 'GMT')})
    polishedObj.metaData.push({'Market' : eventData.selectedMarket.marketName})
    polishedObj.metaData.push({ 'Bet Type' : eventData.setChoice})
    polishedObj.metaData.push({ 'Points Recommended' : eventData.setStake})

    if(eventType === '7') {
      polishedObj.metaData[1]['Event'] = eventData.selectedMarket.event.venue;
      var run = eventData.selectedResult.metadata;
      polishedObj.runnerData = {
        'Age' : run.AGE,
        'Jockey' : run.JOCKEY_NAME,
        'Trainer' : run.TRAINER_NAME,
        'Form' : run.FORM
      }
      polishedObj.colorSrc = 'http://content-cache.betfair.com/feeds_images/Horses/SilkColours/'+run.COLOURS_FILENAME
    }

    polishedObj.priceData = eventData.priceData;

    polishedObj.eventData = {
      'selectionId' : eventData.selectedResult.selectionId,
      'eventTypeId' : eventData.selectedMarket.eventType.id,
      'marketId' : eventData.selectedMarket.marketId,
      'eventId' : eventData.selectedMarket.event.id
    }

    return polishedObj;
  };

  eventService.setMarketBookPayload = function(marketId) {
    var jsonPayload = {
      'marketIds' : [marketId]
    }
    return angular.toJson(jsonPayload);
  };


  return eventService;
}]);
