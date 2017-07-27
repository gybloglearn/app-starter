define([
  './config',
  './run',
  './start/start.ctrl',
  './login/login.ctrl',
  './services/login.service',
  './services/data.service',
  './directives/datepicker',
  './directives/mychart',
  './directives/SL/sl',
  './directives/SM/sm',
  './directives/Potting/potting',
  './filters/sumField',
  './filters/sumdb',
  './dayreport/dayreport.ctrl'
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
  sldir,
  smdir,
  pottdir,
  sumField,
  sumdb,
  dayreportController
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
  app.directive('mychart',mychart);
  app.directive('slDir',sldir);
  app.directive('smDir',smdir);
  app.directive('pottDir',pottdir);
  app.filter('sumField',sumField);
  app.filter('sumdb',sumdb);
  app.controller('dayreportController', dayreportController);
		/* controllers */
});
