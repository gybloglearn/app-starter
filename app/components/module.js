define([
    './config',
    './start/start.ctrl',
    './services/data.service'
	/* files */
], function(
    configFunction,
    startController,
    reportController,
    dataService
	/* names */) {

        // Link all components to the module !!!

        var app = angular.module('app', ['ui.router']);
        app.config(configFunction);
        app.service('Data', dataService);
        app.controller('StartController', startController);
		/* controllers */
    });