/**
 * Factory used to manipulate and sort request data going
 * out as a POST request to the Betfair API
 */
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
  var punditEvents = [];

  /**
   * Set genre of sport by id
   */
  eventService.setSportGenre = function(input) {
    filter.eventTypeIds = [];
    filter.eventTypeIds.push(input.eventType.id);
  };
  /*
   * Set competition by id
   */
  eventService.setCompetition = function(input) {
    filter.competitionIds = [];
    filter.competitionIds.push(input.competition.id);
  };
  /**
   * Set venue for racing
   */
  eventService.setRacingVenue = function(input) {
    filter.venues = [];
    for (var i = 0 ; i < input.length ; i++){
        filter.venues.push(input[i].venue);
    }
  };
  /**
   * Set any optional text query supplied by user
   * @param {String} text - Filter entered by pundit
   */
  eventService.setTextQuery = function(text) {
    filter.textQuery = text;
  };
  /**
   * Set dates for minimum time frame for event
   */
  eventService.setAfterTimeDate = function(date, time) {
    if(date !== null){
      mst.from = this.dateConverter(date, time);
    } else {
      mst.from = '';
    }
  };
  /**
   * Set dates for maximum end time for event
   */
  eventService.setBeforeTimeDate = function(date, time) {
    if(date !== null){
      mst.to = this.dateConverter(date, time);
    } else {
      mst.to= '';
    }
  };
  /**
   * Store results recieved from Betfair for further use
   */
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
    return angular.toJson(filter);
  };
  /**
   * Function to alter date to required formaat
   * @return {String} - JSON serialized date string
   */
  eventService.dateConverter = function(date, time) {
    date.setHours(time.getHours());
    date.setMinutes(time.getMinutes());
    date.setSeconds(time.getSeconds());
    return date.toJSON();
  };
  /**
   * Return the market catalogue filter required by betfair
   */
  eventService.getMarketCatalogueFilter = function(marketType){
    var eventTypeId = filter.eventTypeIds;
    var catFilter = {};
    catFilter.eventTypeIds = eventTypeId;
    if( marketType !== ''){
      catFilter.marketTypeCodes = [marketType];
    }
    catFilter.eventIds = [eventSelected.event.id];
    return angular.toJson(catFilter);
  };

  eventService.getMarketCatalogueData = function() {
    return marketCatalogueData;
  };

  eventService.setMarketCatalogueData = function(data) {
    marketCatalogueData = data;
  };
   /**
   * Return the market filter required by betfair
   */
  eventService.getMarketFilter = function() {
    filter.marketCountries = ['GB', 'IE', 'ES'];
    return angular.toJson(filter);
  };

  /**
   * Format the correct request filter to be expected by Betfair
   * using the data provided by the user through the wizard
   */
  eventService.buildPublishEvent = function(eventData) {
    var polishedObj = {};
    var eventType = eventData.selectedMarket.eventType.id;


    var metaObj = {
      'Selection' : eventData.selectedResult.runnerName,
      'Event' : eventData.selectedMarket.event.name,
      'Start Time' : $filter('date')(eventData.selectedMarket.marketStartTime, 'd/M/yy h:mm a', 'GMT'),
      'Market' : eventData.selectedMarket.marketName,
      'Bet Type' : eventData.setChoice,
      'Points Recommended' : eventData.setStake
    }

    if(eventType === '1') {
      //polishedObj.metaData.push({'Competition' : eventData.selectedMarket.competition.name});
      metaObj.Competition = eventData.selectedMarket.competition.name
    }

    if(eventType === '7') {
      metaObj['Event'] = eventData.selectedMarket.event.venue;
      var run = eventData.selectedResult.metadata;
      polishedObj.runnerData = {
        'Age' : run.AGE,
        'Jockey' : run.JOCKEY_NAME,
        'Trainer' : run.TRAINER_NAME,
        'Form' : run.FORM
      };
      polishedObj.colorSrc = 'http://content-cache.betfair.com/feeds_images/Horses/SilkColours/'+run.COLOURS_FILENAME;
    }
    polishedObj.eventTime = eventData.selectedMarket.event.openDate;
    polishedObj.priceData = eventData.priceData;

    polishedObj.eventData = {
      'selectionId' : eventData.selectedResult.selectionId,
      'eventTypeId' : eventData.selectedMarket.eventType.id,
      'marketId' : eventData.selectedMarket.marketId,
      'eventId' : eventData.selectedMarket.event.id
    };
    polishedObj.metaData = metaObj;
    return polishedObj;
  };
  /**
   * Set the payload for this specific request
   */
  eventService.setMarketBookPayload = function(marketId) {
    var jsonPayload = {
      'marketIds' : [marketId]
    };
    return angular.toJson(jsonPayload);
  };

  eventService.setPunditEventList = function(eventList) {
    punditEvents = eventList;
  };

  eventService.getPunditEventList = function() {
    return punditEvents;
  };


  return eventService;
}]);
