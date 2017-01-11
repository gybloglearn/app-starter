define([
  './config',
  './run',
  './start/start.ctrl',
  './login/login.ctrl',
  './services/login.service',
  './services/data.service',
  './Mtf/Mtf.ctrl',
  './services/MtfService.service',
  './directives/datepicker',
  './directives/mychart',
  './filters/sumdb',
  './filters/sumaeq'
	/* files */
], function(
  configFunction,
  runFunction,
  startController,
  loginController,
  loginService,
  dataService,
  MtfController,
  MtfService,
  datepicker,
  mychart,
  sumdb,
  sumaeq
	/* names */) {

  // Link all components to the module !!!

  var app = angular.module('app', ['ui.router', 'ngCookies']);
  app.config(configFunction);
  app.run(runFunction);
  app.service('Data', dataService);
  app.service('Login', loginService);
  app.controller('StartController', startController);
  app.controller('LoginController', loginController);
  app.controller('MtfController', MtfController);
	app.service('MtfService', MtfService);
  app.directive('datepicker',datepicker);
  app.directive('mychart',mychart);
  app.filter('sumdb',sumdb);
  app.filter('sumaeq',sumaeq)
		/* controllers */
});
