'use strict';
angular.module('BetterBetting')

.factory('statsFactory', ['$filter', function($filter) {
  var stats = {};
  var dict = {};

  stats.getDict = function(){
    return dict
  };

  stats.organiseEvents = function(eventList) {
    var footballStats = [];
    var racingStats = [];
    angular.forEach(eventList, function(event) {
      if (event.event_type_id === 1){
        footballStats.push(event);
      } else {
        racingStats.push(event);
      }
    });
    var punditStats = {
        'football': footballStats,
        'racing': racingStats
      }
      return punditStats
  };

  stats.sortEvents = function(eventList) {
      var punditStats = {};
      punditStats.labels = [];
      punditStats.data = [];
      eventList = eventList.sort(function(a,b){
        return new Date(a.finish_time) - new Date(b.finish_time);
      })
      var outRightArray = [];
      var footballArray = [];
      var racingArray = [];
      var startingPoint = 0;
      var footballRating = 0;
      var racingRating = 0;
      var counter = 0;
      var key = ''

      angular.forEach(eventList, function(event) {

        if(!(event.state == 'Pending')){
        var filteredDate = $filter('date')(event.created_at, 'd/M h:mm a');
        punditStats.labels.push(filteredDate);
        startingPoint = startingPoint + parseFloat(event.adjustment)
        outRightArray.push(startingPoint.toFixed(2))

        if(event.event_type_id === 1){

          key = 'Football' + filteredDate
          footballRating = footballRating + parseFloat(event.adjustment)
          footballArray.push(footballRating.toFixed(2))
          racingArray.push(racingRating.toFixed(2))

        } else {
          key = 'Racing' + filteredDate
          racingRating = racingRating + parseFloat(event.adjustment)
          racingArray.push(racingRating.toFixed(2))
          footballArray.push(footballRating.toFixed(2))
        }
        dict[key] = event;
      }

      });
      punditStats.data.push(outRightArray);
      punditStats.data.push(footballArray);
      punditStats.data.push(racingArray);
      return punditStats;
  };
  return stats;
}
]);
