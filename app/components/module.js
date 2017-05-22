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
	'./ZW1500Selejt/ZW1500Selejt.ctrl',
  './services/ZW1500Selejt.service'
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
	ZW1500SelejtController,
  ZW1500SelejtService
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
	app.controller('ZW1500SelejtController', ZW1500SelejtController);
	app.service('ZW1500SelejtService', ZW1500SelejtService);
		/* controllers */
});
