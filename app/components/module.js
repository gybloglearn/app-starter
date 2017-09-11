define([
  './config',
  './run',
  './start/start.ctrl',
  './login/login.ctrl',
  './services/login.service',
  './services/data.service',
  './directives/datepicker',
  './filters/shift12',
  './filters/shiftfm',
  './filters/client',
  './filters/doctor'
  /* files */
], function (
  configFunction,
  runFunction,
  startController,
  loginController,
  loginService,
  dataService,
  datepicker,
  shift12,
  shiftfm,
  client,
  doctor
/* names */) {

    // Link all components to the module !!!

    var app = angular.module('app', ['ui.router', 'ngCookies']);
    app.config(configFunction);
    app.run(runFunction);
    app.service('Data', dataService);
    app.service('Login', loginService);
    app.controller('StartController', startController);
    app.controller('LoginController', loginController);
    app.directive('datepicker', datepicker);
    app.filter('shift12', shift12);
    app.filter('shiftfm', shiftfm);
    app.filter('client', client);
    app.filter('doctor', doctor);
    /* controllers */
  });
