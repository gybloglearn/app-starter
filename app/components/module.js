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
  './directives/SMdays/smdays',
  './filters/unique',
  './filters/shift',
  './filters/sumdb',
  './filters/sumField',
  './filters/week',
  './services/plan.service',
  './smweek/smweek.ctrl',
  './smshift/smshift.ctrl',
  './services/weekly.service',
  './sscrap/sscrap.ctrl',
  './services/sscrap.service',
  './sumweek/sumweek.ctrl',
  './services/sumweek.service'
	, './efficiency/efficiency.ctrl'
	, './services/efficiency.service'
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
  smdaydir,
  unique,
  shift,
  sumdb,
  sumField,
  week,
  planService,
  smweekController,
  smshiftController,
  weeklyService,
  sscrapController,
  sscrapService,
  sumweekController,
  sumweekService
	, efficiencyController
	, efficiencyService
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
    app.directive('smdayDir',smdaydir);
    app.filter('unique',unique);
    app.filter('shift',shift);
    app.filter('sumdb',sumdb);
    app.filter('sumField',sumField);
    app.filter('week',week);
		app.service('planService', planService);
		app.controller('smweekController', smweekController);
		app.controller('smshiftController', smshiftController);
		app.service('weeklyService', weeklyService);
		app.controller('sscrapController', sscrapController);
		app.service('sscrapService', sscrapService);
		app.controller('sumweekController', sumweekController);
		app.service('sumweekService', sumweekService);
		app.controller('efficiencyController', efficiencyController);
		app.service('efficiencyService', efficiencyService);
		/* controllers */
  });
