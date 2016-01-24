'use strict';
angular.module('BetterBetting.pundit.selection', [])
.config(function($stateProvider){
  $stateProvider.state('pundit.selection', {
    url: '/event/select',
    data : { title: 'Events' },
    views: {
      'layoutMainContent': {
        controller: 'EventSelectionCtrl',
        templateUrl: 'partials/pundit/event/event.tpl.html'
      }
    }
  });
})

.controller('EventSelectionCtrl', ['$scope', 'betfairFactory', 'eventFactory',
                    function($scope, betfairFactory, eventFactory) {

}]);
