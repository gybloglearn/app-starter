define([
  './config',
  './run',
  './start/start.ctrl',
  './login/login.ctrl',
  './services/login.service',
  './services/data.service',
  './sm_data/sm_data.ctrl',
  './plan/plan.ctrl',
  './Forbidden/Forbidden.ctrl',
  './services/smdata.service',
  './directives/datepicker',
  './directives/mychart',
  './directives/SM/sm',
  './filters/unique',
  './filters/shift',
  './filters/sumdb',
  './services/plan.service'
	/* files */
], function (
  configFunction,
  runFunction,
  startController,
  loginController,
  loginService,
  dataService,
  sm_dataController,
  planController,
  ForbiddenController,
  smdataService,
  datepicker,
  mychart,
  smdir,
  unique,
  shift,
  sumdb,
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
    app.controller('sm_dataController', sm_dataController);
    app.controller('planController', planController);
    app.controller('ForbiddenController', ForbiddenController);
    app.service('dataService', dataService);
    app.service('smdataService', smdataService);
    app.directive('datepicker',datepicker);
    app.directive('myChart',mychart);
    app.directive('smDir',smdir);
    app.filter('unique',unique);
    app.filter('shift',shift);
    app.filter('sumdb',sumdb);
		app.service('planService', planService);
		/* controllers */
  });
