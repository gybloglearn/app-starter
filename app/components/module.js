define([
  './config',
  './run',
  './start/start.ctrl',
  './login/login.ctrl',
  './services/login.service',
  './services/data.service',
  './services/history.service',
  './history/history.ctrl',
  './filters/unique',
  './services/event.service',
  './Moduldata/Moduldata.ctrl',
  './services/moduldata.service'
	/* files */
], function(
  configFunction,
  runFunction,
  startController,
  loginController,
  loginService,
  dataService,
  historyService,
  historyController,
  unique,
  eventService,
  ModuldataController,
  moduldataService
	/* names */) {

  // Link all components to the module !!!

  var app = angular.module('app', ['ui.router', 'ngCookies']);
  app.config(configFunction);
  app.run(runFunction);
  app.service('Data', dataService);
  app.service('Login', loginService);
  app.controller('StartController', startController);
  app.controller('LoginController', loginController);
  app.service('historyService', historyService);
	app.controller('historyController', historyController);
  app.filter('unique',unique);
	app.service('eventService', eventService);
	app.controller('ModuldataController', ModuldataController);
	app.service('moduldataService', moduldataService);
		/* controllers */
});
