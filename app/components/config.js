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
	$stateProvider.state('plan', {
		url: '/plan',
		templateUrl: './app/components/plan/plan.html',
		controller: 'planController',
		controllerAs: 'vm'
	});
	$stateProvider.state('day', {
		url: '/day',
		templateUrl: './app/components/day/day.html',
		controller: 'dayController',
		controllerAs: 'vm'
	});
	$stateProvider.state('rewindersum', {
		url: '/rewindersum',
		templateUrl: './app/components/rewindersum/rewindersum.html',
		controller: 'rewindersumController',
		controllerAs: 'vm'
	});
	$stateProvider.state('Rewinder', {
		url: '/Rewinder',
		templateUrl: './app/components/Rewinder/Rewinder.html',
		controller: 'RewinderController',
		controllerAs: 'vm'
	});

  }
  ConfigFunction.$inject = ['$urlRouterProvider', '$stateProvider'];
  return ConfigFunction;
});
