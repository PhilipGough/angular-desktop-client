/**
 * Module which controls the users section as the view data for a
 * particular pundit.
 */
'use strict';
angular.module('BetterBetting.user.punditList', [])
.config(function($stateProvider){
  $stateProvider.state('user.punditList', {
    url: '/pundit/list',
    data : { title: 'Pundit Profile',
              css: ['bower_components/rdash-ui/dist/css/pundit.min.css',
              'bower_components/rdash-ui/dist/css/rdash.min.css']
    },
    views: {
      'layoutMainContent': {
        controller: 'PunditListCtrl',
        controllerAs: 'vm',
        templateUrl: 'partials/user/punditAll.tpl.html'
      }
    }
  });
})
.controller('PunditListCtrl',[ 'restFactory', 'authFactory', function(restFactory, authFactory){

  var vm = this;
  var userId = authFactory.getUserData();
  restFactory.makeGetRequest('pundit')
  .then(function(response){
    console.log(response);
    vm.pundits = response;
    angular.forEach(vm.pundits, function(pundit){
      if(pundit.subscribed.id !== userId){
        pundit.isSubscribed = true;
      } else {
        pundit.isSubscribed = false;
      }
    });
  },function(error){

  });

  vm.paginationController = function(){

  };

}]);
