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
	$stateProvider.state('type', {
		url: '/type',
		templateUrl: './app/components/type/type.html',
		controller: 'typeController',
		controllerAs: 'vm'
	});
	$stateProvider.state('tmk', {
		url: '/tmk',
		templateUrl: './app/components/tmk/tmk.html',
		controller: 'tmkController',
		controllerAs: 'vm'
	});
	$stateProvider.state('shift', {
		url: '/shift',
		templateUrl: './app/components/shift/shift.html',
		controller: 'shiftController',
		controllerAs: 'vm'
	});

  }
  ConfigFunction.$inject = ['$urlRouterProvider', '$stateProvider'];
  return ConfigFunction;
});
