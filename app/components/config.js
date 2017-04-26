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
      controller: function($cookies, $rootScope, $state) {
	$cookies.remove('user', {path:'/');
	$rootScope.user = {};
	$state.go('start', {}, {reload: true});
      }
    });

    /* Add states */
	$stateProvider.state('attempt', {
		url: '/attempt',
		params: {
			attemptobject: ''
		},
		templateUrl: './app/components/attempt/attempt.html',
		controller: 'attemptController',
		controllerAs: 'vm'
	});
	$stateProvider.state('newtest', {
		url: '/newtest',
		params: {
			newtestobject: ''
		},
		templateUrl: './app/components/newtest/newtest.html',
		controller: 'newtestController',
		controllerAs: 'vm'
	});
	$stateProvider.state('plan', {
		url: '/plan',
		templateUrl: './app/components/plan/plan.html',
		controller: 'planController',
		controllerAs: 'vm'
	});
	$stateProvider.state('BPS', {
		url: '/BPS',
		templateUrl: './app/components/BPS/BPS.html',
		controller: 'BPSController',
		controllerAs: 'vm'
	});
	$stateProvider.state('pp', {
		url: '/pp',
		templateUrl: './app/components/pp/pp.html',
		controller: 'ppController',
		controllerAs: 'vm'
	});
	$stateProvider.state('archiv', {
		url: '/archiv',
		templateUrl: './app/components/archiv/archiv.html',
		controller: 'archivController',
		controllerAs: 'vm'
	});
	$stateProvider.state('Mtf', {
		url: '/Mtf',
		templateUrl: './app/components/Mtf/Mtf.html',
		controller: 'MtfController',
		controllerAs: 'vm'
	});

  }
  ConfigFunction.$inject = ['$urlRouterProvider', '$stateProvider'];
  return ConfigFunction;
});
