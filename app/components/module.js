define([
  './config',
  './run',
  './start/start.ctrl',
  './login/login.ctrl',
  './services/login.service',
  './services/data.service',
  './services/stat.service',
  './bstat/bstat.ctrl',
  './directives/datepicker',
  './directives/mychart',
  './directives/ROOM/room',
  './Plan/Plan.ctrl',
  './services/planservice.service',
  './forbidden/forbidden.ctrl'
	/* files */
], function (
  configFunction,
  runFunction,
  startController,
  loginController,
  loginService,
  dataService,
  statService,
  bstatController,
  datepicker,
  mychart,
  roomdir,
  PlanController,
  planserviceService,
  forbiddenController
	/* names */) {

    // Link all components to the module !!!

    var app = angular.module('app', ['ui.router', 'ngCookies']);
    app.config(configFunction);
    app.run(runFunction);
    app.service('Data', dataService);
    app.service('Login', loginService);
    app.controller('StartController', startController);
    app.controller('LoginController', loginController);
    app.service('statService', statService);
    app.controller('bstatController', bstatController);
    app.directive('datepicker', datepicker);
    app.directive('myChart', mychart);
    app.directive('roomDir',roomdir);
    app.controller('PlanController', PlanController);
		app.service('planserviceService', planserviceService);
		app.controller('forbiddenController', forbiddenController);
		/* controllers */
  });
