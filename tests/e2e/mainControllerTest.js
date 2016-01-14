describe('main controller', function() {
  it('should display a welcome message', function() {
    browser.get('http://localhost:3000/#/');
    expect(browser.getTitle()).toEqual('Home');
  });
});
