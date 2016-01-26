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
    $document.find('body')[0].id = 'pundit';

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
]);
