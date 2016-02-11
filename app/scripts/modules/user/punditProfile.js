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
 * @param  {int} $stateParams - The id of the pundit whose profile user is viewing
 * @param  {factory} restFactory - Factory used to make GET request to the API
 * @param  {factory} statsFactory - Factory used to organise and format stats for graph
 * @param  {service} $modal - Modal used to generate event object when graph point clicked
 */
.controller('PunditProfileCtrl', ['$stateParams', 'restFactory', 'statsFactory', '$modal',
                       function($stateParams, restFactory, statsFactory, $modal, $filter) {

    var vm = this;
    vm.format = 'dd-MMMM-yyyy';
    vm.loading = true;
    vm.series = ['Outright', 'Football', 'Racing'];
    vm.colors = ['#b3b3cc', '#85adad', '#b3e6ff']
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
  vm.initilaiseCalenders = function() {
    vm.status = {
      opened: false,
      openedTwo: false
    };
  };

  vm.initilaiseCalenders();

    /*
     * Function used to handle onMouse click event on graph
     * Produces a modal for the relevant event
     * @param  {array} points - The area of points related to mouse click
     * @param  {event} evt - The mouse click event
     */
    vm.onClick = function (points, evt) {
      var eventMap = statsFactory.getDict()
      angular.forEach(points, function(point){
        var key = point.datasetLabel + point.label
        if(eventMap[key]) {
          var event = eventMap[key]

          $modal.open({
            animation: true,
            templateUrl: 'partials/modals/eventDetailed.html',
            controller: ['$modalInstance', 'requiredData', EventModalCtrl],
            controllerAs: 'vm',
            size: 'lg',
            resolve: {
              requiredData: function () { return event }
            }
          });
      }
    })
  };
  /**
   * EventModalCtrl - controller to handle the modal
   * @param {obj} $modalInstance - The modal object
   * @param {obj} requiredData - The event resolved from the mouse click
   */
    function EventModalCtrl($modalInstance, requiredData) {
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
        var stats = statsFactory.sortEvents(response.events);
        vm.data = stats.data
        vm.labels = stats.labels
        vm.loading = false;
      }, function(error){
        vm.loading = false;
        console.log(error)
      });



    vm.alterSubscription = function() {
      restFactory.makePOSTrequest('subscription', {
        'punditId' : $stateParams.punditId
      })
      .then(function (data) {
        console.log(data);
      })
    }
  }
]);
