describe('Login controller unit test', function() {
  var scope;
  var ctrl;
  var mockAuthService;

  beforeEach(module('ui.router'));
  beforeEach(module('flash'));
  beforeEach(module('BetterBetting'));
  beforeEach(module('BetterBetting.login'));

  beforeEach(function() {
    mockAuthService = jasmine.createSpyObj('authFactory', ['getAuthToken']);
  });

  beforeEach(inject(function($rootScope, $controller) {
    authFactory = mockAuthService;
    scope = $rootScope.$new();
    ctrl = $controller('LoginCtrl', {
      $scope : scope
    });
  }));

  describe('$scope.user', function() {
    it('allows the user to enter username and password', function() {
      expect(scope.user.email).toEqual('');
      expect(scope.user.password).toEqual('');
      expect(mockAuthService.getAuthToken).not.toHaveBeenCalled();
    })
  });
});


