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
  './filters/name_change',
  './rewindersum/rewindersum.ctrl',
  './services/rewindersum.service',
  './day/day.ctrl',
  './services/day.service',
  './plan/plan.ctrl',
  './services/plan.service'
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
  name_change,
  rewindersumController,
  rewindersumService,
  dayController,
  dayService,
  planController,
  planService
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
  app.filter('name_change', name_change);
	app.controller('rewindersumController', rewindersumController);
	app.service('rewindersumService', rewindersumService);
	app.controller('dayController', dayController);
	app.service('dayService', dayService);
	app.controller('planController', planController);
	app.service('planService', planService);
		/* controllers */
});
