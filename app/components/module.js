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
  './filters/addtype',
  './filters/shift',
  './filters/name_change',
  './filters/sumField',
  './filters/unique',
	'./archiv/archiv.ctrl',
  './services/archiv.service',
  './pp/pp.ctrl',
  './services/ppdata.service',
  './BPS/BPS.ctrl',
  './services/bpsdata.service',
  './plan/plan.ctrl',
  './services/plan.service',
  './newtest/newtest.ctrl',
  './attempt/attempt.ctrl',
  './modulmap/modulmap.ctrl',
  './services/map.service'
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
  addtype,
  shift,
  name_change,
  sumField,
  unique,
	archivController,
  archivService,
  ppController,
  ppdataService,
  BPSController,
  bpsdataService,
  planController,
  planService,
  newtestController,
  attemptController,
  modulmapController,
  mapService
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
  app.filter('addtype',addtype);
  app.filter('shift',shift);
  app.filter('name_change',name_change);
  app.filter('sumField',sumField);
  app.filter('unique',unique);
	app.controller('archivController', archivController);
	app.service('archivService', archivService);
  app.controller('ppController', ppController);
	app.service('ppdataService', ppdataService);
	app.controller('BPSController', BPSController);
	app.service('bpsdataService', bpsdataService);
	app.controller('planController', planController);
	app.service('planService', planService);
	app.controller('newtestController', newtestController);
	app.controller('attemptController', attemptController);
	app.controller('modulmapController', modulmapController);
	app.service('mapService', mapService);
		/* controllers */
});
