'use strict';
angular.module('BetterBetting')

.controller('EventModalCtrl', ['$modalInstance', 'requiredData', '$state', 'ngDialog',
            function($modalInstance, requiredData, $state, ngDialog){

              ngDialog.close();
              var vm = this;
              vm.tabs = [
              {'title': 'Overview', 'content' : 'partials/modals/tabs/eventOverview.tpl.html' },
              {'title': 'Stats', 'content' : 'partials/modals/tabs/eventStats.tpl.html'}
              ];
              vm.data = requiredData;
              if(vm.data.runnerdata.Colors){
                vm.data.colorSrc = vm.data.runnerdata.Colors;
                delete vm.data.runnerdata.Colors;
              }

              if(vm.data.state === 'Winner') {
                vm.alerts = [{
                  type: 'success',
                  msg: 'Winning bet! Total profit of ' + vm.data.adjustment + ' points !'
                }];
              }
              else if(vm.data.state === 'Loser') {
                vm.alerts = [{
                  type: 'danger',
                  msg: 'Losing bet! Negative adjustment of ' + vm.data.adjustment + ' points !'
                }];
              } else {
                vm.alerts = [{
                  type: 'info',
                  msg: 'Result Pending! No results yet for this event!'
                }];
              }

              vm.closeAlert = function(index) {
                vm.alerts.splice(index, 1);

              };

              //Logic to handle the chart prices

              vm.series = ['Bookmaker Odds', 'Exchange Back Odds', 'Exchange Lay Odds'];
              vm.colors = ['#b3b3cc', '#85adad', '#b3e6ff'];
              vm.chartData = [];
              vm.labels = [];
              vm.priceInfo = {};

              var hasBookmakerData = true;

              var pricedata = angular.fromJson(vm.data.pricedata);
              if(pricedata[0]) {
                vm.priceInfo['Initial Odds'] = pricedata[0].price;
                vm.priceInfo['Best Price'] = 0;
                vm.priceInfo['Last Available Odds'] = pricedata[pricedata.length-1].price;
            }
              var odds = [];
              var exBet = [];
              var exLay = [];
              console.log(pricedata)
              angular.forEach(pricedata, function(value) {
                if(value.price > vm.priceInfo['Best Price']) {
                  vm.priceInfo['Best Price'] = value.price;
                }
                if(value.price) {
                  odds.push(value.price);
                } else {
                  hasBookmakerData = false;
                }
                exBet.push(value['Exchange Back']);
                exLay.push(value['Exchange Lay']);
                vm.labels.push(value.time);
              });

              if(hasBookmakerData) {
                vm.chartData.push(odds, exBet, exLay);
              } else {
                modifyChart();
              }

    function modifyChart() {
      vm.series.shift();
      vm.colors.shift();
      vm.chartData.push(exBet, exLay);
    }


    /*
     * Function used to handle onMouse click event on graph
     * Produces a modal for the relevant event showing bookmakers available with odds at that rate
     * @param  {array} points - The area of points related to mouse click
     * @param  {event} evt - The mouse click event
     */
     vm.onClick = function (points) {
      var key = points[0].label;
      for(var j = 0 ; j < pricedata.length ; j++) {
        if(pricedata[j].time === key) {
          var template = '<h5>Odds available at  the selected time with the following</h5> <ol> ';
          for(var k = 0 ; k < pricedata[j].bookmakers.length; k++){
            template += '<li>' + pricedata[j].bookmakers[k] + '</li> ';
          }
          template += '</ol>';
          ngDialog.open({
            template: template,
            plain: true,
            className: 'ngdialog-theme-default'
          });
        }
      }
    };

  }]);
