define([
    './config',
    './start/start.ctrl',
    './services/data.service',
    './directives/datepicker',
    './directives/mychart',
    './services/tasks.service',
    './addProject/addProject.ctrl',
    './services/projects.service',
    './Projektlista/Projektlista.ctrl'
    /* files */
], function(
  configFunction,
  startController,
  dataService,
  datepicker,
  mychart,
  tasksService,
  addProjectController,
  projectsService,
  ProjektlistaController
  /* names */) {

  // Link all components to the module !!!

  var app = angular.module('app', ['ui.router']);
  app.config(configFunction);
  app.service('Data', dataService);
  app.controller('StartController', startController);
  app.directive('datepicker', datepicker);
  app.directive('myChart', mychart);
  app.service('tasksService', tasksService);
  app.service('projectsService', projectsService);
  app.controller('addProjectController', addProjectController);
  app.controller('ProjektlistaController', ProjektlistaController);
  /* controllers */
});
