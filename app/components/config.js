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
	$stateProvider.state('putmoduls', {
		url: '/putmoduls',
		templateUrl: './app/components/putmoduls/putmoduls.html',
		controller: 'putmodulsController',
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
