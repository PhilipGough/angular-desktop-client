exports.config = {
  seleniumAddress: 'http://localhost:4444/wd/hub',
  specs: ['tests/e2e/*.js'],
  capabilities: {
    browserName: 'chrome'
  },
  baseUrl: 'http://localhost:3000'
};
