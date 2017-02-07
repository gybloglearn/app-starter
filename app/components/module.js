define([
  './config',
  './run',
  './start/start.ctrl',
  './login/login.ctrl',
  './services/login.service',
  './services/data.service',
  './sm_data/sm_data.ctrl',
  './services/data.service',
  './services/smdata.service',
  './directives/datepicker',
  './directives/mychart',
  './directives/SM/sm',
  './filters/unique',
  './filters/shift',
  './filters/sumdb'
  /* files */
], function (
  configFunction,
  runFunction,
  startController,
  loginController,
  loginService,
  dataService,
  sm_dataController,
  dataService,
  smdataService,
  datepicker,
  mychart,
  smdir,
  unique,
  shift,
  sumdb
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
    app.service('dataService', dataService);
    app.service('smdataService', smdataService);
    app.directive('datepicker',datepicker);
    app.directive('myChart',mychart);
    app.directive('smDir',smdir);
    app.filter('unique',unique);
    app.filter('shift',shift);
    app.filter('sumdb',sumdb);
    /* controllers */
  });
