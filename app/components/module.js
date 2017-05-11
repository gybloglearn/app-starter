define([
  './config',
  './run',
  './start/start.ctrl',
  './login/login.ctrl',
  './services/login.service',
  './services/data.service',
  './qcpage/qcpage.ctrl',
  './services/download.service',
  './directives/datepicker',
  './directives/mychart',
	/* files */
], function(
  configFunction,
  runFunction,
  startController,
  loginController,
  loginService,
  dataService,
  qcpageController,
  downloadService,
  datepicker,
  mychart,
	/* names */) {

  // Link all components to the module !!!

  var app = angular.module('app', ['ui.router', 'ngCookies']);
  app.config(configFunction);
  app.run(runFunction);
  app.service('Data', dataService);
  app.service('Login', loginService);
  app.controller('StartController', startController);
  app.controller('LoginController', loginController);
  app.controller('qcpageController', qcpageController);
	app.service('downloadService', downloadService);
  app.directive('datepicker', datepicker);
  app.directive('myChart', mychart);
		/* controllers */
});
