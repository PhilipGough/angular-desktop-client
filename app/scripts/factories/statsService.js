'use strict';
angular.module('BetterBetting')

.factory('statsFactory', ['$filter', function($filter) {
  var stats = {};
  var dict = {};

  function getLastFromArray(arrayIn){
      return arrayIn[arrayIn.length -1]
    };

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
        return new Date(a.created_at) - new Date(b.created_at);
      })
      var outRightArray = [];
      var footballArray = [];
      var racingArray = [];
      var startingPoint = 0;
      var footballRating = 0;
      var racingRating = 0;
      var counter = 0;
      var key = ''
      console.log(eventList)
      angular.forEach(eventList, function(event) {

        if(!(event.state == 'Pending')){
          //var filteredDate = $filter('date')(event.created_at, 'd/M h:mm a');
          var filteredDate = event.created_at;
          computeDateEntry(event.created_at);
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

      function computeDateEntry(dateStrIn) {
        var lastStoredDateStr = getLastFromArray(punditStats.labels);
        var lastDate = new Date(lastStoredDateStr);
        var thisDate = new Date(dateStrIn);
        while((lastDate.setDate(lastDate.getDate() + 1)) < thisDate) {
          var formatDate = new Date(lastDate.setHours(0,0,0,0));
          punditStats.labels.push(formatDate.toString());
          outRightArray.push(getLastFromArray(outRightArray));
          racingArray.push(getLastFromArray(racingArray));
          footballArray.push(getLastFromArray(footballArray));

        }
      }
  };
  return stats;
}
]);
