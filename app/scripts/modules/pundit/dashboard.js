'use strict';
angular.module('BetterBetting.pundit', [])
.config(function($stateProvider){
  $stateProvider.state('pundit.dashboard', {
    url: '/dashboard',
    data : {
      title: 'Dashboard'
    },
    views: {
      'layoutMainContent': {
        templateUrl: 'partials/pundit/dashboard.tpl.html'
      }
    }
  });
})

.controller('PunditHomeCtrl', ['$scope', '$document', function($scope, $document) {
    $scope.toggle = true;
    $document.find('body')[0].id = 'pundit'

    $scope.toggleSidebar = function() {
        $scope.toggle = !$scope.toggle;
    };

}])

.controller('AlertsCtrl', ['$scope', function($scope) {
    $scope.alerts = [{
        type: 'success',
        msg: 'Thanks for visiting! Feel free to create pull requests to improve the dashboard!'
    }, {
        type: 'danger',
        msg: 'Found a bug? Create an issue with as many details as you can.'
    }];

    $scope.addAlert = function() {
        $scope.alerts.push({
            msg: 'Another alert!'
        });
    };

    $scope.closeAlert = function(index) {
        $scope.alerts.splice(index, 1);
    };
  }
])

.directive('rdLoading', function rdLoading() {
    var directive = {
        restrict: 'AE',
        template: '<div class="loading"><div class="double-bounce1"></div><div class="double-bounce2"></div></div>'
    };
    return directive;
})

.directive('rdWidgetBody', function rdWidgetBody() {
    var directive = {
        requires: '^rdWidget',
        scope: {
            loading: '@?',
            classes: '@?'
        },
        transclude: true,
        template: '<div class="widget-body" ng-class="classes"><rd-loading ng-show="loading"></rd-loading><div ng-hide="loading" class="widget-content" ng-transclude></div></div>',
        restrict: 'E'
    };
    return directive;
})

.directive('rdWidgetFooter', function rdWidgetFooter() {
    var directive = {
        requires: '^rdWidget',
        transclude: true,
        template: '<div class="widget-footer" ng-transclude></div>',
        restrict: 'E'
    };
    return directive;
})

.directive('rdWidgetHeader', function rdWidgetTitle() {
    var directive = {
        requires: '^rdWidget',
        scope: {
            title: '@',
            icon: '@'
        },
        transclude: true,
        template: '<div class="widget-header"><div class="row"><div class="pull-left"><i class="fa" ng-class="icon"></i> {{title}} </div><div class="pull-right col-xs-6 col-sm-4" ng-transclude></div></div></div>',
        restrict: 'E'
    };
    return directive;
})

.directive('rdWidget', function rdWidget() {
    var directive = {
        transclude: true,
        template: '<div class="widget" ng-transclude></div>',
        restrict: 'EA'
    };
    return directive;
});
