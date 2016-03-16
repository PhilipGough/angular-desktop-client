'use strict';
angular.module('BetterBetting')

.controller('EventModalCtrl', ['$modalInstance', 'requiredData', '$state', 'ngDialog',
                  function($modalInstance, requiredData, $state, ngDialog){

    ngDialog.close();
    var vm = this;
    vm.data = requiredData;
  console.log(vm)
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

    $modalInstance.close();
    vm.closeAlert = function(index) {
        vm.alerts.splice(index, 1);
        /**
         * Fetch an instance of a pundit based on id and
         * navigate to that pundits profile
         * @param  {int} pundit_id - The id of the pundit selected
         */
   vm.getPundit = function(pundit_id){
    $modalInstance.close();
    $state.go('user.punditProfile/'+pundit_id);
  };
};

}]);
