'use strict';

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

angular.module('BetterBetting')
.directive('punditTabCard', punditTabCard);



