define([
  './config',
  './run',
  './start/start.ctrl',
  './login/login.ctrl',
  './services/login.service',
  './services/data.service'
  , './services/bpsdata.service',
  './directives/mychart',
  './directives/datepicker',
  './filters/unique'
	, './BPS/BPS.ctrl'
	/* files */
], function(
  configFunction,
  runFunction,
  startController,
  loginController,
  loginService,
  dataService
, bpsdataService
, mychart
, datepicker
, unique
	, BPSController
	/* names */) {

  // Link all components to the module !!!

  var app = angular.module('app', ['ui.router', 'ngCookies']);
  app.config(configFunction);
  app.run(runFunction);
  app.service('Data', dataService);
  app.service('Login', loginService);
  app.controller('StartController', startController);
  app.controller('LoginController', loginController);
  app.service('bpsdataService', bpsdataService);
  app.directive('myChart', mychart);
  app.directive('datepicker', datepicker);
  app.filter('unique', unique);
		app.controller('BPSController', BPSController);
		/* controllers */
});
