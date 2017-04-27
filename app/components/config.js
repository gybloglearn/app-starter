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
	$stateProvider.state('forbidden', {
		url: '/forbidden',
		templateUrl: './app/components/forbidden/forbidden.html',
		controller: 'forbiddenController',
		controllerAs: 'vm'
	});
	$stateProvider.state('Plan', {
		url: '/Plan',
		templateUrl: './app/components/Plan/Plan.html',
		controller: 'PlanController',
		controllerAs: 'vm'
	});
	$stateProvider.state('bstat', {
		url: '/bstat',
		templateUrl: './app/components/bstat/bstat.html',
		controller: 'bstatController',
		controllerAs: 'vm'
	});

  }
  ConfigFunction.$inject = ['$urlRouterProvider', '$stateProvider'];
  return ConfigFunction;
});
