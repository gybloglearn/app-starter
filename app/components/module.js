define([
  './config',
  './run',
  './start/start.ctrl',
  './login/login.ctrl',
  './services/login.service',
  './services/data.service',
  './wip/wip.ctrl',
  './services/wip.service',
  './directives/datepicker',
  './directives/mychart',
  './filters/unique'
  /* files */
], function (
  configFunction,
  runFunction,
  startController,
  loginController,
  loginService,
  dataService,
  wipController,
  wipService,
  datepicker,
  mychart,
  unique
	/* names */) {

    // Link all components to the module !!!

    var app = angular.module('app', ['ui.router', 'ngCookies']);
    app.config(configFunction);
    app.run(runFunction);
    app.service('Data', dataService);
    app.service('Login', loginService);
    app.controller('StartController', startController);
    app.controller('LoginController', loginController);
    app.controller('wipController', wipController);
    app.service('wipService', wipService);
    app.directive('datepicker', datepicker);
    app.directive('mychart', mychart);
    app.filter('unique', unique);
    /* controllers */
  });
