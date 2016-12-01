define([
    './config',
    './start/start.ctrl',
    './services/data.service'
	, './assessment/assessment.ctrl'
	, './services/users.service'
	, './services/areas.service'
	/* files */
], function(
    configFunction,
    startController,
    dataService
	, assessmentController
	, usersService
	, areasService
	/* names */) {

        // Link all components to the module !!!

        var app = angular.module('app', ['ui.router']);
        app.config(configFunction);
        app.service('Data', dataService);
        app.controller('StartController', startController);
		app.controller('assessmentController', assessmentController);
		app.service('usersService', usersService);
		app.service('areasService', areasService);
		/* controllers */
    });