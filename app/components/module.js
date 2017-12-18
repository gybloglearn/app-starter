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
  './directives/Modulmap/modulmap',
  './filters/sumdb',
  './filters/sumaeq',
  './filters/change',
  './filters/changenum',
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
  './services/map.service',
  './cl4/cl4.ctrl',
  './services/cl4.service',
  './reworks/reworks.ctrl',
  './services/reworks.service',
  './map/map.ctrl'
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
  modulmapdir,
  sumdb,
  sumaeq,
  change,
  changenum,
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
  mapService,
  cl4Controller,
  cl4Service,
  reworksController,
  reworksService,
  mapController
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
  app.directive('modulmapDir', modulmapdir);
  app.filter('sumdb',sumdb);
  app.filter('sumaeq',sumaeq);
  app.filter('change',change);
  app.filter('changenum',changenum);
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
  app.controller('mapController', mapController);
	app.service('mapService', mapService);
	app.controller('cl4Controller', cl4Controller);
	app.service('cl4Service', cl4Service);
	app.controller('reworksController', reworksController);
	app.service('reworksService', reworksService);
		/* controllers */
});
