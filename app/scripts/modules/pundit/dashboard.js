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
            return restFactory.makeGetRequest('user')
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
   vm.punditEvents = getPublishedEvents;
   eventFactory.setPunditEventList(vm.punditEvents);
   console.log(vm.punditEvents)
   vm.userRating = getPundit.rating;
   vm.subscriberNum = getPundit.subscribed.length;
   vm.subscribers = getPundit.subscribed;
   vm.fltrEvents = $filter('publishedEvenFilter')(vm.punditEvents);
   vm.hasUnseenEvents = false;
   vm.hasPendingEvents = false;
   angular.forEach(vm.fltrEvents, function(event){
    if(event.state === 'Pending'){
      vm.hasPendingEvents = true;
    } else if(event.unseen === true) {
      console.log('Here', event)
      vm.hasUnseenEvents = true;
    }
   });
   vm.tabs = [
        {'title': 'Stats', 'content' : 'partials/user/punditStats.tpl.html'}
        ]


  /**
   * Allows user to click an area of chart
   * @param  {event} event - Mouse click event
   */
   vm.show = function(event) {

    for(var i = 0 ; i < vm.punditEvents.length ; i++) {
        if(vm.punditEvents[i].id === event.id) {
            var requiredData = vm.punditEvents[i];
            break;
        }
    }

      $modal.open({
      animation: true,
      templateUrl: 'partials/modals/eventDetailed.html',
      controller: ['$modalInstance', 'requiredData', EventModalCtrl],
      controllerAs: 'vm',
      size: 'lg',
      resolve: {
        requiredData: function () { return requiredData}
      }
    });
   };

   /*
    * Initialise the chart from the service
    */
   vm = statsFactory.initChart(vm);

    vm.open = function($event, calender) {
      if(calender === 1){
        vm.status.opened = true;
      } else {
        vm.status.openedTwo = true;
      }
    };
    /*
     * Temp patch to bug in chart library
     */
    var $chart;
      $scope.$on("create", function (event, chart) {
      if (typeof $chart !== "undefined") {
      $chart.destroy();
      }
      $chart = chart;
    });

    /*
     * Function used to handle onMouse click event on graph
     * Produces a modal for the relevant event
     * @param  {array} points - The area of points related to mouse click
     * @param  {event} evt - The mouse click event
     */
    vm.onClick = function (points, evt) {
      var key = points[0].label;
      var eventsAtDate = statsFactory.getDict()[key]
      if(eventsAtDate){
        ngDialog.open({
          template: 'partials/user/punditEvenList.tpl.html',
          controller: ['eventsAtDate', EventListCtrl],
          controllerAs: 'vm',
          resolve : {
            eventsAtDate: function() { return eventsAtDate}
          }
        });
      }
    };

  /**
    *  Resolves the pundit information via HTTP request
    *  Uses the stats service to organise the object
    */
    vm.pundit = restFactory.makeGetRequest('pundit/'+getPundit.id)
      .then(function(response) {
        var stats = statsFactory.computeEventData(response.events)
        if(stats){
          vm.data = stats.data
          vm.labels = stats.labels
        }
        vm.initilaiseCalenders(statsFactory.getStartDate());
      }, function(error){
        console.log(error)
      });


   /*
    * Initialise the calender with the calculated data
    */
    vm.initilaiseCalenders = function(afterDate) {
      vm.minDate = afterDate;
      vm.afterDate = new Date(afterDate);
      vm.maxDate = new Date();
      vm.beforeDate = vm.maxDate;
      vm.status = {
        opened: false,
        openedTwo: false
      };
    };

  vm.continue = statsFactory.getContinueFunc(vm);





   /**
    * Controls the modal for this event when event is clicked by user
    */
    function EventModalCtrl($modalInstance, requiredData) {
      ngDialog.close();
      var vm = this;
      vm.data = requiredData;
      if(vm.data.runnerdata.Colors){
          vm.data.colorSrc = vm.data.runnerdata.Colors;
          delete vm.data.runnerdata.Colors;
      }
      if(vm.data.state === 'Winner') {
        vm.alerts = [{
            type: 'success',
            msg: 'Winning bet! Total profit of ' + vm.data.adjustment + ' points !'}]
      }
      else if (vm.data.state === 'Loser') {
        vm.alerts = [{
            type: 'danger',
            msg: 'Losing bet! Negative adjustment of ' + vm.data.adjustment + ' points !'}]
      } else {
        vm.alerts = [{
            type: 'info',
            msg: 'Result Pending! No results yet for this event!'}]
      }

      $modalInstance.close();

      vm.closeAlert = function(index) {
        vm.alerts.splice(index, 1);
    };
  };


  function EventListCtrl(eventsAtDate) {
    var vm = this;
    vm.unfilteredEvents = eventsAtDate;
    vm.events = $filter('publishedEvenFilter')(eventsAtDate);
    vm.show = function(eventId) {
    var requiredEvent = null;
      for(var i = 0 ; i < vm.unfilteredEvents.length ; i++){
        if(vm.unfilteredEvents[i].id === eventId) {
          requiredEvent = vm.unfilteredEvents[i];
          break;
        }
      }
       $modal.open({
            animation: true,
            templateUrl: 'partials/modals/eventDetailed.html',
            controller: ['$modalInstance', 'requiredData', EventModalCtrl],
            controllerAs: 'vm',
            size: 'lg',
            resolve: {
              requiredData: function () { return requiredEvent }
            }
          });
    }
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
    };


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
