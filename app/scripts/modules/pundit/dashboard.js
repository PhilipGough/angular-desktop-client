/**
 * Module which handles the landing page for a pundit type user
 */
'use strict';
angular.module('BetterBetting.pundit', [])
.config(function($stateProvider){
  $stateProvider.state('pundit.dashboard', {
    url: '/dashboard',
    data : {
      title: 'Dashboard',
      css: ['bower_components/rdash-ui/dist/css/pundit.min.css',
                    'bower_components/rdash-ui/dist/css/rdash.min.css']
    },
    views: {
      'layoutMainContent': {
        controller: 'PunditDashboardCtrl',
        controllerAs: 'vm',
        templateUrl: 'partials/pundit/dashboard.tpl.html'
      }
    },
    resolve: {
        getPublishedEvents : function(restFactory) {
            return restFactory.makeGetRequest('event');
        },
         getPundit : function(restFactory) {
            return restFactory.makeGetRequest('user');
        }
    }
  });
})
/**
 * Alter the css class and toggle sidebar function
 */
.controller('PunditHomeCtrl', ['$scope', '$document',
                                     function($scope, $document) {
    $scope.toggle = true;
    $document.find('body')[0].id = 'pundit';

    $scope.toggleSidebar = function() {
        $scope.toggle = !$scope.toggle;
    };

    $scope.items = [
      {'text':'Create', 'link': 'pundit.event', 'icon': 'fa-pencil-square-o'},
      {'text':'View', 'link': 'pundit.viewEvent', 'icon': 'fa-eye'}
    ];

  $scope.status = {
    isopen: false
  };

  $scope.isToggled = false;
  $scope.logout = function() {
      localStorage.removeItem('betterTradingToken');
      $state.go('preAuth.home');
    };

  $scope.toggled = function() {
    $scope.isToggled = ! $scope.isToggled;
  };
}])

/**
 * Main controller for this view. Filter events into well formatted objects.
 * Display modal for a pundit when clicked by user in the list
 */
.controller('PunditDashboardCtrl', ['$modal', 'getPublishedEvents','$filter',
                    'getPundit', 'restFactory', 'statsFactory','$scope', 'ngDialog', 'eventFactory',
                       function($modal, getPublishedEvents,$filter, getPundit,
                                      restFactory, statsFactory, $scope, ngDialog, eventFactory) {

   var vm = this;
   vm.punditId = (getPundit.id).toString();
   vm.punditEvents = getPublishedEvents;
   eventFactory.setPunditEventList(vm.punditEvents);
   vm.userRating = getPundit.rating;
   vm.subscriberNum = getPundit.subscribed.length;
   vm.subscribers = getPundit.subscribed;
   vm.fltrEvents = $filter('publishedEvenFilter')(vm.punditEvents);
   vm.hasUnseenEvents = false;
   vm.hasPendingEvents = false;

   angular.forEach(vm.fltrEvents, function(event){
    if(event.state === 'Pending'){
      vm.hasPendingEvents = true;
    }   else if(event.unseen === true) {
          vm.hasUnseenEvents = true;
        }
   });

   vm.tabs = [{'title': 'Stats', 'content' : 'partials/user/punditStats.tpl.html'}];
   vm.requiredData = {
        all: vm.punditEvents,
        filtered: vm.fltrEvents
      };

}])

/**
 * Controller to handle, generate and delete alerts
 * Will display a welcome alert at each successful login
 */
.controller('AlertsCtrl', ['$scope', 'authFactory',
                                function($scope, authFactory) {

    $scope.alerts = [];
    var user = authFactory.getUserData();
    if( Object.keys(user).length > 0 && user.welcome){

        var msg = {
                type: 'success',
                msg: 'Welcome ' + user.name
            };
        $scope.alerts.push(msg);
        authFactory.markVisited();
    }


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
