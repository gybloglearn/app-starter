define([],function () {
  'use strict';
  function ConfigFunction($urlRouterProvider, $stateProvider) {
    $urlRouterProvider.otherwise('/');

    //Add state to all routes

    $stateProvider.
      state('start', {
        url: '/',
        templateUrl: './js/components/start/start.html',
        controller: 'StartController',
        controllerAs: 'vm'
      });
  }
  ConfigFunction.$inject = ['$urlRouterProvider', '$stateProvider'];
  return ConfigFunction;
});