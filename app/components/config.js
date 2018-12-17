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
	$stateProvider.state('downtimeimpregnal', {
		url: '/downtimeimpregnal',
		templateUrl: './app/components/downtimeimpregnal/downtimeimpregnal.html',
		controller: 'downtimeimpregnalController',
		controllerAs: 'vm'
	});
	$stateProvider.state('downtimefluxus', {
		url: '/downtimefluxus',
		templateUrl: './app/components/downtimefluxus/downtimefluxus.html',
		controller: 'downtimefluxusController',
		controllerAs: 'vm'
	});
	$stateProvider.state('downtimechlor', {
		url: '/downtimechlor',
		templateUrl: './app/components/downtimechlor/downtimechlor.html',
		controller: 'downtimechlorController',
		controllerAs: 'vm'
	});
	$stateProvider.state('downtimepotting', {
		url: '/downtimepotting',
		templateUrl: './app/components/downtimepotting/downtimepotting.html',
		controller: 'downtimepottingController',
		controllerAs: 'vm'
	});
	$stateProvider.state('pdt', {
		url: '/pdt',
		templateUrl: './app/components/pdt/pdt.html',
		controller: 'pdtController',
		controllerAs: 'vm'
	});
	$stateProvider.state('potting', {
		url: '/potting',
		templateUrl: './app/components/potting/potting.html',
		controller: 'pottingController',
		controllerAs: 'vm'
	});
	$stateProvider.state('fluxus', {
		url: '/fluxus',
		templateUrl: './app/components/fluxus/fluxus.html',
		controller: 'fluxusController',
		controllerAs: 'vm'
	});
	$stateProvider.state('uf', {
		url: '/uf',
		templateUrl: './app/components/uf/uf.html',
		controller: 'ufController',
		controllerAs: 'vm'
	});

  }
  ConfigFunction.$inject = ['$urlRouterProvider', '$stateProvider'];
  return ConfigFunction;
});
