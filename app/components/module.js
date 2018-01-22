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
  './filters/week',
  './clevent/clevent.ctrl',
  './services/clevent.service'
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
  week,
  cleventController,
  cleventService
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
  app.filter('week',week);
  app.controller('cleventController', cleventController);
	app.service('cleventService', cleventService);
		/* controllers */
});
