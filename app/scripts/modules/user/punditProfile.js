/**
 * Module which controls the users section as the view data for a
 * particular pundit.
 */
'use strict';
angular.module('BetterBetting.user.punditProfile', [])
.config(function($stateProvider){
  $stateProvider.state('user.punditProfile', {
    url: '/profile/{punditId:int}',
    data : { title: 'Pundit List',
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
.controller('PunditProfileCtrl', ['$stateParams', 'restFactory', 'authFactory',
                       function($stateParams, restFactory, authFactory) {
    var vm = this;
    vm.subscribed = false;
    vm.loading = true;
    vm.tabs = [
        {'title': 'Overview', 'content' : 'partials/user/punditOverview.tpl.html' },
        {'title': 'Stats', 'content' : 'partials/user/punditStats.tpl.html'}
        ];
    vm.resource = $stateParams.punditId;
    vm.punditId = vm.resource.toString();

  function createOverview(response){
      var user = authFactory.getUserData();
        vm.punditName = response.username;
        vm.punditOverview = {
          'Active for' : ' '+(response.active_days).toString() + ' days',
          'Average bets per day' : ' '+(response.events.length/response.active_days),
          'Subscribers' : response.subscribed.length
        };
        var wins = 0;
        var eventsSettled = 0;
        for(var i = 0 ; i < response.events.length; i++) {
          if(response.events[i].state !== 'Pending') {
            eventsSettled += 1;
            if(response.events[i].state === 'Winner'){
              wins += 1;
            }
          }
        }

        vm.punditOverview['Strike rate'] = ((wins /eventsSettled) * 100).toString() + '%';
        for(i=0 ; i< response.subscribed.length; i++){
          if(user.id === response.subscribed[i].id){
              vm.subscribed = true;
              break;
          }
        }
  }


    vm.pundit = restFactory.makeGetRequest('pundit/'+ vm.resource)
    .then(function(response) {
      createOverview(response);
      vm.loading = false;
    });



    vm.alterSubscription = function() {
      restFactory.makePOSTrequest('subscription', {
        'punditId' : $stateParams.punditId
      })
      .then(function (data) {
        vm.subscribed = true;
      });
    };

    vm.deleteSubscription = function(){
      restFactory.makeDeleteRequest('subscription/'+$stateParams.punditId)
      .then(function (data) {
        vm.subscribed = false;
      });
    };
  }
]);
