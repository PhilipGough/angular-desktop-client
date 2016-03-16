'use strict';
angular.module('BetterBetting')

.directive('userUnseenEvent', userUnseenEvent);

function UnseenEventController($state, restFactory) {

    var vm = this;
    vm.data = [];
    vm.labels = [];


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
  vm.chartOption = {bezierCurve: false}

  var pricedata = angular.fromJson(vm.event.pricedata);
  var odds = [];
  var exBet = [];
  var exLay = [];
  angular.forEach(pricedata, function(value) {
    odds.push(value['price']);
    exBet.push(value['Exchange Back']);
    exLay.push(value['Exchange Lay']);
    vm.labels.push(value.time);
  })
  vm.data.push(odds, exBet, exLay);

  /**
   * Fetch an instance of a pundit based on id and
   * navigate to that pundits profile
   * @param  {int} pundit_id - The id of the pundit selected
   */
   vm.getPundit = function(pundit_id){
    $state.go('user.punditProfile/'+pundit_id);
      restFactory.makeGetRequest('pundit/'+pundit_id)
      .then(function(data){
          console.log(data);
      });
  };

}

function userUnseenEvent() {
    var directive = {
        restrict: 'EA',
        templateUrl: 'partials/directiveTemplates/userUnseenEvent.tpl.html',
        scope: {
            event: '='
        },
        controller: UnseenEventController,
        controllerAs: 'vm',
        bindToController: true
    };

    return directive;
}

