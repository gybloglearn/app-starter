define([
  './config',
  './run',
  './start/start.ctrl',
  './login/login.ctrl',
  './services/login.service',
  './services/data.service',
  './directives/datepicker',
  './directives/mychart',
  './directives/mystockchart',
  './directives/SL/sl',
  './directives/SM/sm',
  './directives/Potting/potting',
  './directives/MTF/mtf',
  './filters/sumField',
  './filters/sumdb',
  './filters/shift',
  './dayreport/dayreport.ctrl'
  , './sap/sap.ctrl'
	, './today/today.ctrl'
	/* files */
], function (
  configFunction,
  runFunction,
  startController,
  loginController,
  loginService,
  dataService,
  datepicker,
  mychart,
  mystockchart,
  sldir,
  smdir,
  pottdir,
  mtfdir,
  sumField,
  sumdb,
  shift,
  dayreportController
	, sapController
	, todayController
	/* names */) {

    // Link all components to the module !!!

    var app = angular.module('app', ['ui.router', 'ngCookies']);
    app.config(configFunction);
    app.run(runFunction);
    app.service('Data', dataService);
    app.service('Login', loginService);
    app.controller('StartController', startController);
    app.controller('LoginController', loginController);
    app.directive('datepicker', datepicker);
    app.directive('mychart', mychart);
    app.directive('mystockchart', mystockchart);
    app.directive('slDir', sldir);
    app.directive('smDir', smdir);
    app.directive('pottDir', pottdir);
    app.directive('mtfDir', mtfdir);
    app.filter('sumField', sumField);
    app.filter('sumdb', sumdb);
    app.filter('shift', shift);
    app.controller('dayreportController', dayreportController);
    app.controller('sapController', sapController);
		app.controller('todayController', todayController);
		/* controllers */
  });
