'use strict';
angular.module('BetterBetting')

.controller('UnseenEventController', [ function () {

  var vm = this;

  if(vm.event.runnerdata.Colors){
    vm.event.colorSrc = vm.event.runnerdata.Colors;
    delete vm.event.runnerdata.Colors;
  }
  vm.tabs = [
  {'title': 'Overview', 'content' : 'partials/directiveTemplates/eventDetailed.tpl.html' },
  {'title': 'Stats', 'content' : 'partials/user/eventStats.tpl.html'}
  ];

  vm.series = ['Bookmaker Odds', 'Exchange Back Odds', 'Exchange Lay Odds'];
  vm.colors = ['#b3b3cc', '#85adad', '#b3e6ff'];
  vm.chartData = [];
  vm.labels = [];
  var hasBookmakerData = true;

  vm.priceInfo = {};
  var pricedata = angular.fromJson(vm.event.pricedata);

  if(pricedata[0]) {
    vm.priceInfo['Initial Odds'] = pricedata[0].price || pricedata[0]['Exchange Back'];
    vm.priceInfo['Best Price'] = 0;
    vm.priceInfo['Last Available Odds'] = pricedata[pricedata.length-1].price || pricedata[pricedata.length-1]['Exchange Back'];
  }

  var odds = [];
  var exBet = [];
  var exLay = [];
  angular.forEach(pricedata, function(value) {
    if(value.price && value.price > vm.priceInfo['Best Price']) {
      vm.priceInfo['Best Price'] = value.price;
    } else {
      if(value['Exchange Back'] && value['Exchange Back']> vm.priceInfo['Best Price']) {
        vm.priceInfo['Best Price'] = value['Exchange Back']
      }
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


}]);
