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
  './filters/sumdb',
  './filters/sumField',
  './filters/shift',
  './filters/shiftnumber',
  './filters/changeDate',
  './uf/uf.ctrl',
  './services/uf.service'
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
  sumdb,
  sumField,
  shift,
  shiftnumber,
  changeDate,
  ufController,
  ufService
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
  app.filter('sumdb',sumdb);
  app.filter('sumField',sumField);
  app.filter('shift',shift);
  app.filter('shiftnumber',shiftnumber);
  app.filter('changeDate',changeDate);
  app.controller('ufController', ufController);
	app.service('ufService', ufService);
		/* controllers */
});
