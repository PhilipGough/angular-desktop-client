'use strict';
angular.module('BetterBetting')

.directive('pendingEvent', pendingEvent)
.directive('pendingEventPundit', pendingEventPundit);

function pendingEvent() {
    var directive = {
        restrict: 'EA',
        templateUrl: 'partials/directiveTemplates/eventPending.tpl.html',
        link: linkFunc,
        scope: {
            eventData: '=input'
        },
        controller: 'PendingEventController',
        controllerAs: 'vm',
        bindToController: true
    };

    return directive;

    function linkFunc(scope, el, attr, ctrl) {
        //console.log(scope, el, attr)
    }
};


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
};


