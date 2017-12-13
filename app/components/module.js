define([
  './config',
  './run',
  './start/start.ctrl',
  './login/login.ctrl',
  './services/login.service',
  './services/data.service',
  './map/map.ctrl',
  './services/map.service',
  './directives/datepicker',
  './directives/mychart',
  './directives/Modulmap/modulmap',
  './filters/sumdb',
  './filters/sumaeq',
  './filters/change',
  './filters/changenum',
  './filters/addtype',
  './filters/shift',
  './filters/name_change',
  './filters/sumField',
  './filters/unique'
  /* files */
], function (
  configFunction,
  runFunction,
  startController,
  loginController,
  loginService,
  dataService,
  mapController,
  mapService,
  datepicker,
  mychart,
  modulmapdir,
  sumdb,
  sumaeq,
  change,
  changenum,
  addtype,
  shift,
  name_change,
  sumField,
  unique
	/* names */) {

    // Link all components to the module !!!

    var app = angular.module('app', ['ui.router', 'ngCookies']);
    app.config(configFunction);
    app.run(runFunction);
    app.service('Data', dataService);
    app.service('Login', loginService);
    app.controller('StartController', startController);
    app.controller('LoginController', loginController);
    app.controller('mapController', mapController);
    app.service('mapService', mapService);
    app.directive('datepicker', datepicker);
    app.directive('mychart', mychart);
    app.directive('modulmapDir', modulmapdir);
    app.filter('sumdb', sumdb);
    app.filter('sumaeq', sumaeq);
    app.filter('change', change);
    app.filter('changenum', changenum);
    app.filter('addtype', addtype);
    app.filter('shift', shift);
    app.filter('name_change', name_change);
    app.filter('sumField', sumField);
    app.filter('unique', unique);
    /* controllers */
  });
