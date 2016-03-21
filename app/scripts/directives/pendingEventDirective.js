'use strict';

function pendingEvent() {
    var directive = {
        restrict: 'EA',
        templateUrl: 'partials/directiveTemplates/eventPending.tpl.html',
        scope: {
            eventData: '=input'
        },
        controller: 'PendingEventController',
        controllerAs: 'vm',
        bindToController: true
    };

    return directive;

}


function pendingEventPundit() {
    var directive = {
        restrict: 'EA',
        templateUrl: 'partials/directiveTemplates/punditEventPending.tpl.html',
        scope: {
            eventData: '=input'
        },
        controller: 'PendingEventController',
        controllerAs: 'vm',
        bindToController: true
    };

    return directive;
}



angular.module('BetterBetting')

.directive('pendingEvent', pendingEvent)
.directive('pendingEventPundit', pendingEventPundit);



