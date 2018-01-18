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
	$cookies.remove('user', {path: '/'});
	$rootScope.user = {};
	$state.go('start', {}, {reload: true});
      }
    });

    /* Add states */
	$stateProvider.state('sumweek', {
		url: '/sumweek',
		templateUrl: './app/components/sumweek/sumweek.html',
		controller: 'sumweekController',
		controllerAs: 'vm'
	});
	$stateProvider.state('sscrap', {
		url: '/sscrap',
		templateUrl: './app/components/sscrap/sscrap.html',
		controller: 'sscrapController',
		controllerAs: 'vm'
	});
	$stateProvider.state('smweek', {
		url: '/smweek',
		templateUrl: './app/components/smweek/smweek.html',
		controller: 'smweekController',
		controllerAs: 'vm'
	});
	$stateProvider.state('Forbidden', {
		url: '/Forbidden',
		templateUrl: './app/components/Forbidden/Forbidden.html',
		controller: 'ForbiddenController',
		controllerAs: 'vm'
	});
	$stateProvider.state('plan', {
		url: '/plan',
		templateUrl: './app/components/plan/plan.html',
		controller: 'planController',
		controllerAs: 'vm'
	});
	$stateProvider.state('sm_data', {
		url: '/sm_data',
		templateUrl: './app/components/sm_data/sm_data.html',
		controller: 'sm_dataController',
		controllerAs: 'vm'
	});

  }
  ConfigFunction.$inject = ['$urlRouterProvider', '$stateProvider'];
  return ConfigFunction;
});
