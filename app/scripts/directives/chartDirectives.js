'use strict';
angular.module('BetterBetting')

  .directive('barsView', function () {
        return {
            restrict: 'E',
            scope: { data: '=' },
            link: renderView
        };
  });
