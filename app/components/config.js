define([], function () {
  'use strict';
  function ConfigFunction($urlRouterProvider, $stateProvider) {
    $urlRouterProvider.otherwise('/');

    //Add state to all routes

    $stateProvider.state('start', {
      url: '/',
      templateUrl: './app/components/start/start.html',
      controller: 'StartController',
      controllerAs: 'vm'
    });

    /* Add states */

    $stateProvider.state('addTask', {
      url: '/addTask',
      templateUrl: './app/components/addTask/addTask.html',
      controller: 'addTaskController',
      controllerAs: 'vm'
    });
  }
  ConfigFunction.$inject = ['$urlRouterProvider', '$stateProvider'];
  return ConfigFunction;
});