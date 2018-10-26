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
  './filters/shift',
  './filters/sumdb',
  './filters/sumField',
  './uf/uf.ctrl',
  './services/uf.service',
  './fluxus/fluxus.ctrl',
  './services/fluxus.service',
  './potting/potting.ctrl',
  './services/potting.service',
  './pdt/pdt.ctrl',
  './services/pdt.service'
	/* files */
], function(
  configFunction,
  runFunction,
  startController,
  loginController,
  loginService,
  dataService,
  datepicker,
  mychart,
  unique,
  shift,
  sumdb,
  sumField,
  ufController,
  ufService,
  fluxusController,
  fluxusService,
  pottingController,
  pottingService,
  pdtController,
  pdtService
	/* names */) {

  // Link all components to the module !!!

  var app = angular.module('app', ['ui.router', 'ngCookies']);
  app.config(configFunction);
  app.run(runFunction);
  app.service('Data', dataService);
  app.service('Login', loginService);
  app.controller('StartController', startController);
  app.controller('LoginController', loginController);
  app.directive('datepicker',datepicker);
  app.directive('myChart',mychart);
  app.filter('unique',unique);
  app.filter('shift',shift);
  app.filter('sumdb',sumdb);
  app.filter('sumField',sumField);
  app.controller('ufController', ufController);
  app.service('ufService', ufService);
	app.controller('fluxusController', fluxusController);
	app.service('fluxusService', fluxusService);
	app.controller('pottingController', pottingController);
	app.service('pottingService', pottingService);
	app.controller('pdtController', pdtController);
	app.service('pdtService', pdtService);
		/* controllers */
});
