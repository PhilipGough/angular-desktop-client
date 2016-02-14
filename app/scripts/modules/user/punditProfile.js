/**
 * Module which controls the users section as the view data for a
 * particular pundit.
 */
'use strict';
angular.module('BetterBetting.user.punditProfile', [])
.config(function($stateProvider){
  $stateProvider.state('user.punditProfile', {
    url: '/profile/{punditId:int}',
    data : { title: 'Pundit Profile',
              css: ['bower_components/rdash-ui/dist/css/pundit.min.css',
                    'bower_components/rdash-ui/dist/css/rdash.min.css']
          },
    views: {
      'layoutMainContent': {
        controller: 'PunditProfileCtrl',
        controllerAs: 'vm',
        templateUrl: 'partials/user/pundit.tpl.html'
      }
    }
  });
})
/**
 * Controller for this users view. Launches a model when user clicks on the pundits
 * statistics graph.
 */
.controller('PunditProfileCtrl', ['$stateParams', 'restFactory',
                'statsFactory', '$modal', '$filter', '$timeout', 'ngDialog',
                       function($stateParams, restFactory, statsFactory,
                                        $modal, $filter, $timeout, ngDialog) {
    var vm = this;
    vm.format = 'dd-MMMM-yyyy';
    vm.loading = true;
    vm.series = ['Outright', 'Football', 'Racing'];
    vm.colors = ['#b3b3cc', '#85adad', '#b3e6ff'];
    vm.tabs = [
        {'title': 'Overview', 'content' : 'partials/user/punditOverview.tpl.html' },
        {'title': 'Stats', 'content' : 'partials/user/punditStats.tpl.html'}
        ]

    vm.open = function($event, calender) {
      if(calender === 1){
        vm.status.opened = true;
      } else {
        vm.status.openedTwo = true;
      }
    };

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

  vm.continue = function() {
    console.log(vm.afterDate, vm.beforeDate)
    statsFactory.populateLabels(vm.afterDate, vm.beforeDate);
    vm.series = [];
    vm.colors = [];
    var stats = statsFactory.populateData();
    vm.data = stats.data
    var dataCount = 0;
    if(vm.outright){
      vm.series.push('Outright');
      vm.colors.push('#b3b3cc');
      dataCount += 1;
    } else {
      vm.data.splice(dataCount, 1);
    }
    if(vm.football){
      vm.series.push('Football');
      vm.colors.push('#85adad');
      dataCount += 1;
    } else {
      vm.data.splice(dataCount, 1);
    }
     if(vm.racing){
      vm.series.push('Racing');
      vm.colors.push('#b3e6ff');
    }else {
      vm.data.splice(dataCount, 1);
    }
    vm.labels = stats.labels
  };

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

  /**
   * EventModalCtrl - controller to handle the modal
   * @param {obj} $modalInstance - The modal object
   * @param {obj} requiredData - The event resolved from the mouse click
   */
    function EventModalCtrl($modalInstance, requiredData) {
      ngDialog.close();
      var vm = this;
      var colors = requiredData.runnerdata.Colors;
      if(colors) {
        delete requiredData.runnerdata['Colors'];
      }
      vm.data = requiredData;
      vm.data.colorSrc = colors;
      if(vm.data.state === 'Winner') {
        vm.alerts = [{
            type: 'success',
            msg: 'Winning bet! Total profit of ' + vm.data.adjustment + ' points !'}]
      }
      else if (vm.data.state === 'Loser') {
        vm.alerts = [{
            type: 'danger',
            msg: 'Losing bet! Negative adjustment of ' + vm.data.adjustment + ' points !'}]
      }
      $modalInstance.close();
     };

     /**
      *  Resolves the pundit information via HTTP request
      *  Uses the stats service to organise the object
      */
    vm.pundit = restFactory.makeGetRequest('pundit/'+$stateParams.punditId)
      .then(function(response) {
        var stats = statsFactory.computeEventData(response.events)
        //var stats = statsFactory.sortEvents(response.events);
        vm.data = stats.data
        vm.labels = stats.labels
        vm.initilaiseCalenders(statsFactory.getStartDate());
        $timeout(stopLoading, 1500);
      }, function(error){
         $timeout(stopLoading, 1500);
        console.log(error)
      });

    vm.alterSubscription = function() {
      restFactory.makePOSTrequest('subscription', {
        'punditId' : $stateParams.punditId
      })
      .then(function (data) {
        console.log(data);
      })
    };

    function stopLoading(){
      vm.loading = false;
    };
  }
]);
