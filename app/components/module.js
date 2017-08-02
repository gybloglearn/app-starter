define([
  './config',
  './run',
  './start/start.ctrl',
  './login/login.ctrl',
  './services/login.service',
  './services/data.service',
  './directives/datepicker',
  './services/update.service',
  './shift/shift.ctrl',
  './tmk/tmk.ctrl',
  './type/type.ctrl'
	/* files */
], function(
  configFunction,
  runFunction,
  startController,
  loginController,
  loginService,
  dataService,
  datepicker,
  updateService,
  shiftController,
  tmkController,
  typeController
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
  app.service('updateService', updateService);
	app.controller('shiftController', shiftController);
	app.controller('tmkController', tmkController);
	app.controller('typeController', typeController);
		/* controllers */
});
