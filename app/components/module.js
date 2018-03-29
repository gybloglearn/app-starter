define([
  './config',
  './run',
  './start/start.ctrl',
  './login/login.ctrl',
  './services/login.service',
  './services/data.service',
  './amount/amount.ctrl',
  './services/amount.service',
  './directives/datepicker',
  './directives/mychart',
  './filters/unique',
  './filters/sumField',
  './filters/week',
  './downtime/downtime.ctrl',
  './services/downtime.service',
  './scrap/scrap.ctrl',
  './services/scrap.service',
  './oee/oee.ctrl',
  './services/oee.service'
	/* files */
], function (
  configFunction,
  runFunction,
  startController,
  loginController,
  loginService,
  dataService,
  amountController,
  amountService,
  datepicker,
  mychart,
  unique,
  sumField,
  week,
  downtimeController,
  downtimeService,
  scrapController,
  scrapService,
  oeeController,
  oeeService
	/* names */) {

    // Link all components to the module !!!

    var app = angular.module('app', ['ui.router', 'ngCookies']);
    app.config(configFunction);
    app.run(runFunction);
    app.service('Data', dataService);
    app.service('Login', loginService);
    app.controller('StartController', startController);
    app.controller('LoginController', loginController);
    app.controller('amountController', amountController);
    app.service('amountService', amountService);
    app.directive('datepicker', datepicker);
    app.directive('mychart', mychart);
    app.filter('unique',unique);
    app.filter('sumField',sumField);
    app.filter('week',week);
    app.controller('downtimeController', downtimeController);
		app.service('downtimeService', downtimeService);
		app.controller('scrapController', scrapController);
		app.service('scrapService', scrapService);
		app.controller('oeeController', oeeController);
		app.service('oeeService', oeeService);
		/* controllers */
  });
