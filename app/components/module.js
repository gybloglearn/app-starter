define([
  './config',
  './run',
  './start/start.ctrl',
  './login/login.ctrl',
  './services/login.service',
  './services/data.service',
  './Potting/Potting.ctrl',
  './services/PottingService.service',
  './directives/datepicker',
  './directives/mychart',
  './filters/unique',
  './filters/sumdb',
  './filters/sumaeq',
  './filters/shift'
	/* files */
], function(
  configFunction,
  runFunction,
  startController,
  loginController,
  loginService,
  dataService,
  PottingController,
  PottingService,
  datepicker,
  mychart,
  unique,
  sumdb,
  sumaeq,
  shift
	/* names */) {

  // Link all components to the module !!!

  var app = angular.module('app', ['ui.router', 'ngCookies']);
  app.config(configFunction);
  app.run(runFunction);
  app.service('Data', dataService);
  app.service('Login', loginService);
  app.controller('StartController', startController);
  app.controller('LoginController', loginController);
  app.controller('PottingController', PottingController);
	app.service('PottingService', PottingService);
  app.directive('datepicker',datepicker);
  app.directive('myChart',mychart);
  app.filter('unique',unique);
  app.filter('sumdb',sumdb);
  app.filter('sumaeq',sumaeq);
  app.filter('shift',shift);
		/* controllers */
});
