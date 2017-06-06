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
	$stateProvider.state('Operators', {
		url: '/Operators',
		templateUrl: './app/components/Operators/Operators.html',
		controller: 'OperatorsController',
		controllerAs: 'vm'
	});
	$stateProvider.state('Pottingsum', {
		url: '/Pottingsum',
		templateUrl: './app/components/Pottingsum/Pottingsum.html',
		controller: 'PottingsumController',
		controllerAs: 'vm'
	});
	$stateProvider.state('Potting', {
		url: '/Potting',
		templateUrl: './app/components/Potting/Potting.html',
		controller: 'PottingController',
		controllerAs: 'vm'
	});

  }
  ConfigFunction.$inject = ['$urlRouterProvider', '$stateProvider'];
  return ConfigFunction;
});
