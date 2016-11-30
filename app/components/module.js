define([
    './config',
    './start/start.ctrl',
    './report/report.ctrl',
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
        app.controller('ReportController', reportController);
/* controllers */
    });