'use strict';
angular.module('BetterBetting')

.directive('eventFull', function() {
    var directive = {
        restrict: 'AE',
        templateUrl: 'partials/directiveTemplates/eventFull.tpl.html'
    };
    return directive;
})

.directive('eventUnseen', function() {
    var directive = {
        restrict: 'AE',
        templateUrl: 'partials/directiveTemplates/eventUnseen.tpl.html',
        scope: {
            eventData: '=input'
        },
        controller: 'PendingEventController',
        controllerAs: 'vm',
        bindToController: true
    };
    return directive;
})

.directive('eventPending', function() {
    var directive = {
        restrict: 'AE',
        templateUrl: 'partials/directiveTemplates/eventPending.tpl.html'
    };
    return directive;
})

.directive('mySubscribers', function() {
    var directive = {
        restrict: 'AE',
        templateUrl: 'partials/directiveTemplates/subscribers.tpl.html'
    };
    return directive;
});
