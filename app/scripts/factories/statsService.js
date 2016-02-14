'use strict';
angular.module('BetterBetting')

.factory('statsFactory', ['$filter', function($filter) {
  var stats = {};
  var dict = {};
  var punditStats = {};
  var statistics = {
    'overall' : {},
    'football' : {},
    'racing' : {}
  };
  var afterDate = null;


  stats.computeEventData = function(eventList){
    eventList = sortByDate(eventList);
    var startDate = new Date(eventList[0].created_at);
    afterDate = angular.copy(startDate);
    var endDate = new Date();
    stats.populateLabels(startDate, endDate, initStatValues);
    angular.forEach(eventList, function(event) {
        if(!(event.state == 'Pending')){
          var dateKey = $filter('date')(event.created_at, 'd/M/yy');
          if (!(dict[dateKey])) {
            dict[dateKey] = [];
          }
          dict[dateKey].push(event);
          var adjustment = parseFloat(event.adjustment);
          statistics.overall[dateKey] = statistics.overall[dateKey] + adjustment;
          if(event.event_type_id === 1){
            statistics.football[dateKey] = statistics.football[dateKey] + adjustment;
          } else {
            statistics.racing[dateKey] = statistics.racing[dateKey] + adjustment;
          }
        }
    });
    return stats.populateData();
  };


  stats.populateLabels = function(startDate, endDate, callback) {
    stats.labels = [];
    var initDate = new Date(startDate);
    initDate.setDate(startDate.getDate()-1)
    initDate.setHours(0,0,0,0);
    endDate.setHours(0,0,0,0);

    while(initDate < endDate) {
      var filteredDate = $filter('date')(initDate, 'd/M/yy');
      stats.labels.push(filteredDate);
      if(callback) {
        callback(filteredDate);
      }
      initDate.setDate(initDate.getDate() + 1);
    }
  };

   stats.populateData = function(){
    stats.data = [];
    var outRightArray = [];
    var footballArray = [];
    var racingArray = [];
    for(var i = 0 ; i < stats.labels.length ; i ++) {
      var key = stats.labels[i];
      outRightArray.push(calculateDataValue(outRightArray, statistics.overall, key));
      footballArray.push(calculateDataValue(footballArray, statistics.football, key));
      racingArray.push(calculateDataValue(racingArray, statistics.racing, key));
    }
    stats.data.push(outRightArray, footballArray, racingArray);
    return stats;
  };

  stats.getStartDate = function() {
    return afterDate;
  }

  function initStatValues(filteredDate) {
      statistics.overall[filteredDate] = 0;
      statistics.football[filteredDate] = 0;
      statistics.racing[filteredDate] = 0;
  };

  function calculateDataValue(arrayIn, objIn, key) {
    if(arrayIn[arrayIn.length -1] === undefined) {
      return objIn[key];
    } else {
       return arrayIn[arrayIn.length -1] + objIn[key];
    }
  };

  function sortByDate(eventList) {
     eventList = eventList.sort(function(a,b){
        return new Date(a.created_at) - new Date(b.created_at);
      });
     return eventList;
   };

   function sortEventList(eventList) {
    var filteredDate = $filter('date')(event.created_at, 'd/M h:mm a');
     if(!(event.state == 'Pending')){

       if(event.event_type_id === 1){
        key = 'Football' + filteredDate
        footballEvents.push(event);
       } else {
        key = 'Racing' + filteredDate;
        racingEvents.push(event);
       }
       dict[key] = event;
     }
   };


  stats.getDict = function(){
    return dict
  };

return stats;
}
]);
