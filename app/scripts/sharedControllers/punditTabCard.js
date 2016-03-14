'use strict';
angular.module('BetterBetting')

.controller('PunditTabCardController',['statsFactory', 'ngDialog', 'restFactory', '$scope',                   function(statsFactory, ngDialog, restFactory, $scope){

  var vm = this;
  vm.format = 'dd-MMMM-yyyy';
  vm.loading = true;
  vm.series = ['Outright', 'Football', 'Racing'];
  vm.colors = ['#b3b3cc', '#85adad', '#b3e6ff'];
  vm.loading = true;

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
      vm.beforeDate = new Date();
      vm.status = {
        opened: false,
        openedTwo: false
      };
    };

      /**
    *  Resolves the pundit information via HTTP request
    *  Uses the stats service to organise the object
    */
    vm.pundit = restFactory.makeGetRequest('pundit/'+ vm.resource)
    .then(function(response) {
      var stats = statsFactory.computeEventData(response.events);
      if(stats){
        vm.data = stats.data;
        vm.labels = stats.labels;
      }
      vm.initilaiseCalenders(statsFactory.getStartDate());
      vm.loading = false;
    }, function(error){
      console.log(error);
    });

    /*
     * Temp patch to bug in chart library
     */
     var $chart;
     $scope.$on('create', function (event, chart) {
      if (typeof $chart !== 'undefined') {
        $chart.destroy();
      }
      $chart = chart;
    });

    /**
     * Function to reload the graph with the modified input
     */
    vm.continue = function() {
      statsFactory.populateLabels(vm.afterDate, vm.beforeDate);
      vm.series = [];
      vm.colors = [];
      var stats = statsFactory.populateData();
      vm.data = stats.data;
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
      vm.labels = stats.labels;
    };

    /*
     * Function used to handle onMouse click event on graph
     * Produces a modal for the relevant event
     * @param  {array} points - The area of points related to mouse click
     * @param  {event} evt - The mouse click event
     */
     vm.onClick = function (points) {
      var key = points[0].label;
      var eventsAtDate = statsFactory.getDict()[key];
      if(eventsAtDate){
        ngDialog.open({
          template: 'partials/user/punditEvenList.tpl.html',
          controller: 'EventListCtrl',
          controllerAs: 'vm',
          resolve : {
            eventsAtDate: function() {
                return eventsAtDate;
              }
          }
        });
      }
    };

}]);


