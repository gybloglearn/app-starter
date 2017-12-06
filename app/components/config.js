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
    $stateProvider.state('login', {
      url: '/login',
      templateUrl: './app/components/login/login.html',
      controller: 'LoginController',
      controllerAs: 'vm'
    });
    $stateProvider.state('logout', {
      url: '/logout',
      controller: function ($cookies, $rootScope, $state) {
        $cookies.remove('user', {path: '/'});
        $rootScope.user = {};
        $state.go('start', {}, { reload: true });
      }
    });

    /* Add states */
	$stateProvider.state('Moduldata', {
		url: '/Moduldata/:modulid',
		templateUrl: './app/components/Moduldata/Moduldata.html',
		controller: 'ModuldataController',
		controllerAs: 'vm'
	});
	$stateProvider.state('history', {
		url: '/history/:modulid',
		templateUrl: './app/components/history/history.html',
		controller: 'historyController',
		controllerAs: 'vm'
	});

  }
  ConfigFunction.$inject = ['$urlRouterProvider', '$stateProvider'];
  return ConfigFunction;
});
