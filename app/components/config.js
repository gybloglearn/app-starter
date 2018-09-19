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
	$stateProvider.state('shiftday', {
		url: '/shiftday',
		templateUrl: './app/components/shiftday/shiftday.html',
		controller: 'shiftdayController',
		controllerAs: 'vm'
	});
	$stateProvider.state('downtime', {
		url: '/downtime',
		templateUrl: './app/components/downtime/downtime.html',
		controller: 'downtimeController',
		controllerAs: 'vm'
	});
	$stateProvider.state('clevent', {
		url: '/clevent',
		templateUrl: './app/components/clevent/clevent.html',
		controller: 'cleventController',
		controllerAs: 'vm'
	});

  }
  ConfigFunction.$inject = ['$urlRouterProvider', '$stateProvider'];
  return ConfigFunction;
});
