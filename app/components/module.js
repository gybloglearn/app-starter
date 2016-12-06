define([
    './config',
    './start/start.ctrl',
    './services/data.service',
    './directives/datepicker',
    './directives/mychart'
	, './services/tasks.service'
	, './addTask/addTask.ctrl'
	/* files */
], function(
    configFunction,
    startController,
    dataService,
    datepicker,
    mychart
	, tasksService
	, addTaskController
	/* names */) {

        // Link all components to the module !!!

        var app = angular.module('app', ['ui.router']);
        app.config(configFunction);
        app.service('Data', dataService);
        app.controller('StartController', startController);
        app.directive('datepicker', datepicker);
        app.directive('myChart', mychart);
		app.service('tasksService', tasksService);
		app.controller('addTaskController', addTaskController);
		/* controllers */
    });