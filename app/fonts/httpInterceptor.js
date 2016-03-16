/**
 * Redirect on error response status code
 */
 'use strict';
 angular.module('BetterBetting.pundit')

 .factory('httpErrorResponseInterceptor', ['$q', '$location',
          function($q, $location) {
            return {
              response: function(responseData) {
                return responseData;
              },
              responseError: function error(response) {
                switch (response.status) {
                  case 401:
                  $location.path('/login');
                  break;
                  case 404:
                  $location.path('/404');
                  break;
                  default:
                  break;
                }

                return $q.reject(response);
              }
            };
          }
])

 .factory('httpNetErrorResponseInterceptor', ['$q', '$location',
          function($q, $location) {

            return {
              responseError: function(rejection) {
                if(rejection.status <= 0) {
                   $location.path('/login');
                  return;
                }
                return $q.reject(rejection);
              }
            };
          }
]);
