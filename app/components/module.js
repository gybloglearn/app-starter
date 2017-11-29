define([
  './config',
  './run',
  './start/start.ctrl',
  './login/login.ctrl',
  './services/login.service',
  './services/data.service',
  './Potting/Potting.ctrl',
  './services/PottingService.service',
  './directives/datepicker',
  './directives/countdown',
  './directives/mychart',
  './directives/Places/place',
  './directives/Operators/Op',
  './filters/unique',
  './filters/sumdb',
  './filters/sumaeq',
  './filters/shift',
  './filters/name_change',
  './filters/sumField',
  './Pottingsum/Pottingsum.ctrl',
  './services/Sumservice.service',
  './Operators/Operators.ctrl',
  './drying/drying.ctrl',
  './services/dry.service'

	, './Downtime/Downtime.ctrl'
	/* files */
], function(
  configFunction,
  runFunction,
  startController,
  loginController,
  loginService,
  dataService,
  PottingController,
  PottingService,
  datepicker,
  countdown,
  mychart,
  placedir,
  opdir,
  unique,
  sumdb,
  sumaeq,
  shift,
  name_change,
  sumField,
  PottingsumController,
  SumserviceService,
  OperatorsController,
  dryingController,
  dryService
	, DowntimeController
	/* names */) {

  // Link all components to the module !!!

  var app = angular.module('app', ['ui.router', 'ngCookies']);
  app.config(configFunction);
  app.run(runFunction);
  app.service('Data', dataService);
  app.service('Login', loginService);
  app.controller('StartController', startController);
  app.controller('LoginController', loginController);
  app.controller('PottingController', PottingController);
	app.service('PottingService', PottingService);
  app.directive('datepicker',datepicker);
  app.directive('countdown',countdown);
  app.directive('myChart',mychart);
  app.directive('placeDir',placedir);
  app.directive('opDir',opdir);
  app.filter('unique',unique);
  app.filter('sumdb',sumdb);
  app.filter('sumaeq',sumaeq);
  app.filter('shift',shift);
  app.filter('name_change',name_change);
  app.filter('sumField',sumField);
	app.controller('PottingsumController', PottingsumController);
	app.service('SumserviceService', SumserviceService);
	app.controller('OperatorsController', OperatorsController);
  app.controller('dryingController', dryingController);
	app.service('dryService', dryService);
		app.controller('DowntimeController', DowntimeController);
		/* controllers */
});
