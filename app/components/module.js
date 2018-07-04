define([
  './config',
  './run',
  './start/start.ctrl',
  './login/login.ctrl',
  './services/login.service',
  './services/data.service',
  './directives/datepicker',
  './directives/mychart',
  './uf/uf.ctrl',
  './services/uf.service',
  './fluxus/fluxus.ctrl',
  './services/fluxus.service'
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
  ufController,
  ufService,
  fluxusController,
  fluxusService
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
  app.controller('ufController', ufController);
  app.service('ufService', ufService);
	app.controller('fluxusController', fluxusController);
	app.service('fluxusService', fluxusService);
		/* controllers */
});
