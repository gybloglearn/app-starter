define([
  './config',
  './run',
  './start/start.ctrl',
  './login/login.ctrl',
  './services/login.service',
  './services/data.service',
  './directives/datepicker',
  './directives/mychart',
  './filters/unique',
  './filters/sumField'
  /* files */
], function (
  configFunction,
  runFunction,
  startController,
  loginController,
  loginService,
  dataService,
  datepicker,
  mychart,
  unique,
  sumField
/* names */) {

    // Link all components to the module !!!

    var app = angular.module('app', ['ui.router', 'ngCookies']);
    app.config(configFunction);
    app.run(runFunction);
    app.service('Data', dataService);
    app.service('Login', loginService);
    app.controller('StartController', startController);
    app.controller('LoginController', loginController);
    app.directive('datepicker', datepicker);
    app.directive('mychart', mychart);
    app.filter('unique',unique);
    app.filter('sumField',sumField);
    /* controllers */
  });
