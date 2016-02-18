'use strict';
angular.module('BetterBetting')

.directive('punditTabCard', punditTabCard);

function punditTabCard() {
    var directive = {
        restrict: 'EA',
        templateUrl: 'partials/directiveTemplates/punditCard.tpl.html',
        scope: {
            tabs: '=',
            resource: '='
        },
        controller: 'PunditTabCardController',
        controllerAs: 'vm',
        bindToController: true
    };

    return directive;
}


