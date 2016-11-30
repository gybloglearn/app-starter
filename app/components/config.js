define([], function () {
  'use strict';
  function ConfigFunction($urlRouterProvider, $stateProvider) {
    $urlRouterProvider.otherwise('/');

    //Add state to all routes

    $stateProvider.
      state('start', {
        url: '/',
        templateUrl: './app/components/start/start.html',
        controller: 'StartController',
        controllerAs: 'vm'
      });

    $stateProvider.state('report', {
      url: '/report',
      templateUrl: './app/components/report/report.html',
      controller: 'ReportController',
      controllerAs: 'vm'
    });

    /* Add states */

  }
  ConfigFunction.$inject = ['$urlRouterProvider', '$stateProvider'];
  return ConfigFunction;
});