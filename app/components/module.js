define([
  './config',
  './run',
  './start/start.ctrl',
  './login/login.ctrl',
  './services/login.service',
  './services/data.service',
  './directives/datepicker',
  './directives/mychart',
  './services/tasks.service',
  './addProject/addProject.ctrl',
  './services/projects.service',
  './Projektlista/Projektlista.ctrl',
  './addTask/addTask.ctrl',
  './Feladatlista/Feladatlista.ctrl',
  './filters/change',
  './filters/change_priority',
  './Sprint/Sprint.ctrl',
  './services/sprint.service',
  './Forbidden/Forbidden.ctrl'
	/* files */
], function(
  configFunction,
  runFunction,
  startController,
  loginController,
  loginService,
  dataService,
  datepicker,
  mychart,
  tasksService,
  addProjectController,
  projectsService,
  ProjektlistaController,
  addTaskController,
  FeladatlistaController,
  change,
  change_priority,
  SprintController,
  sprintService,
  ForbiddenController
	/* names */) {

  // Link all components to the module !!!

  var app = angular.module('app', ['ui.router', 'ngCookies']);
  app.config(configFunction);
  app.run(runFunction);
  app.service('Data', dataService);
  app.controller('StartController', startController);
  app.controller('LoginController', loginController);
  app.service('Login', loginService);
  app.directive('datepicker', datepicker);
  app.directive('myChart', mychart);
  app.service('tasksService', tasksService);
  app.service('projectsService', projectsService);
  app.controller('addProjectController', addProjectController);
  app.controller('ProjektlistaController', ProjektlistaController);
  app.controller('addTaskController', addTaskController);
  app.controller('FeladatlistaController', FeladatlistaController);
  app.filter('change',change);
  app.filter('change_priority',change_priority);
  app.controller('SprintController', SprintController);
  app.service('sprintService', sprintService);
  app.controller('ForbiddenController', ForbiddenController);
		/* controllers */
});
