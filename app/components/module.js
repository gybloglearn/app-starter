define([
  './config',
  './run',
  './start/start.ctrl',
  './login/login.ctrl',
  './services/login.service',
  './services/data.service',
  './Mtf/Mtf.ctrl',
  './services/MtfService.service',
  './directives/datepicker',
  './directives/mychart',
  './filters/sumdb',
  './filters/sumaeq',
  './filters/change',
  './filters/shift',
  './filters/name_change',
  './filters/sumField',
	'./archiv/archiv.ctrl',
  './services/archiv.service'
	/* files */
], function(
  configFunction,
  runFunction,
  startController,
  loginController,
  loginService,
  dataService,
  MtfController,
  MtfService,
  datepicker,
  mychart,
  sumdb,
  sumaeq,
  change,
  shift,
  name_change,
  sumField,
	archivController,
  archivService
	/* names */) {

  // Link all components to the module !!!

  var app = angular.module('app', ['ui.router', 'ngCookies']);
  app.config(configFunction);
  app.run(runFunction);
  app.service('dataService', dataService);
  app.service('Login', loginService);
  app.controller('StartController', startController);
  app.controller('LoginController', loginController);
  app.controller('MtfController', MtfController);
	app.service('MtfService', MtfService);
  app.directive('datepicker',datepicker);
  app.directive('mychart',mychart);
  app.filter('sumdb',sumdb);
  app.filter('sumaeq',sumaeq);
  app.filter('change',change);
  app.filter('shift',shift);
  app.filter('name_change',name_change);
  app.filter('sumField',sumField);
	app.controller('archivController', archivController);
	app.service('archivService', archivService);
		/* controllers */
});
