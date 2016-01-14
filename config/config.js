var convict = require('convict');
var config = convict({
  env: {
    doc: 'The Application Environment',
    format: ['production', 'development', 'mobile', 'test'],
    default: 'development',
    env: 'NODE_ENV'
  },
  build_destination: {
    doc: 'Destination to send built files',
    format: '*',
    default: './dist/',
    env: 'Build_Destination'
  },
  mobile: {
    doc: 'Enable Mobile Conditional Settings/Code',
    format: '*',
    default: true,
    env: 'MOBILE'
  },
  app_title: {
    doc: 'App Title',
    format: '*',
    default: 'App Title',
    env: 'App_Title'
  },
  app_description: {
    doc: 'App Description',
    format: '*',
    default: 'App Description',
    env: 'App_Description'
  }
});

//Load Environment Dependent Configuration
config.loadFile('./config/'+config.get('env')+'.json');

//Validate
config.validate();

module.exports = config;
