'use strict';

function userUnseenEvent() {
    var directive = {
        restrict: 'EA',
        templateUrl: 'partials/directiveTemplates/userUnseenEvent.tpl.html',
        scope: {
            event: '='
        },
        controller: 'UnseenEventController',
        controllerAs: 'vm',
        bindToController: true
    };

    return directive;
}

angular.module('BetterBetting')
.directive('userUnseenEvent', userUnseenEvent);


