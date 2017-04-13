define([
  './config',
  './run',
  './start/start.ctrl',
  './login/login.ctrl',
  './services/login.service',
  './services/data.service',
  './services/gradeyear.service',
  './gradeyear/gradeyear.ctrl',
  './directives/mychart',
  './filters/unique'
	/* files */
], function(
  configFunction,
  runFunction,
  startController,
  loginController,
  loginService,
  dataService,
  gradeyearService,
  gradeyearController,
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
  app.service('gradeyearService', gradeyearService);
	app.controller('gradeyearController', gradeyearController);
  app.directive('mychart',mychart);
  app.filter('unique',unique);
		/* controllers */
});
