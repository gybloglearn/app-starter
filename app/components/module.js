define([
  './config',
  './run',
  './start/start.ctrl',
  './login/login.ctrl',
  './services/login.service',
  './services/data.service',
  './Rewinder/Rewinder.ctrl',
  './services/Rewinder.service',
  './directives/datepicker',
  './directives/mychart',
  './filters/sumField',
  './filters/sumdb',
  './filters/unique',
  './filters/shift',
  './rewindersum/rewindersum.ctrl',
  './services/rewindersum.service'
	/* files */
], function(
  configFunction,
  runFunction,
  startController,
  loginController,
  loginService,
  dataService,
  RewinderController,
  RewinderService,
  datepicker,
  mychart,
  sumField,
  sumdb,
  unique,
  shift,
  rewindersumController,
  rewindersumService
	/* names */) {

  // Link all components to the module !!!

  var app = angular.module('app', ['ui.router', 'ngCookies']);
  app.config(configFunction);
  app.run(runFunction);
  app.service('Data', dataService);
  app.service('Login', loginService);
  app.controller('StartController', startController);
  app.controller('LoginController', loginController);
  app.controller('RewinderController', RewinderController);
  app.service('RewinderService', RewinderService);
  app.directive('datepicker', datepicker);
  app.directive('mychart', mychart);
  app.filter('sumField', sumField);
  app.filter('sumdb', sumdb);
  app.filter('unique', unique);
  app.filter('shift', shift);
	app.controller('rewindersumController', rewindersumController);
	app.service('rewindersumService', rewindersumService);
		/* controllers */
});
