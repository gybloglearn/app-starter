define([
  './config',
  './run',
  './start/start.ctrl',
  './login/login.ctrl',
  './services/login.service',
  './services/data.service',
  './directives/mychart',
  './directives/datepicker',
  './filters/unique'
  , './filters/sumdb'
	, './services/smscr.service'
	/* files */
], function(
  configFunction,
  runFunction,
  startController,
  loginController,
  loginService,
  dataService
, mychart
, datepicker
, unique
, sumdb
	, smscrService
	/* names */) {

  // Link all components to the module !!!

  var app = angular.module('app', ['ui.router', 'ngCookies']);
  app.config(configFunction);
  app.run(runFunction);
  app.service('Data', dataService);
  app.service('Login', loginService);
  app.controller('StartController', startController);
  app.controller('LoginController', loginController);
  app.directive('myChart', mychart);
  app.directive('datepicker', datepicker);
  app.filter('unique', unique);
  app.filter('sumdb', sumdb);
	app.service('smscrService', smscrService);
		/* controllers */
});
