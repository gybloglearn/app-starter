define([], function () {
  'use strict';
  function ConfigFunction($urlRouterProvider, $stateProvider) {
    $urlRouterProvider.otherwise('/');

		
    var d = new Date().getTime().toString().substr(-5);
    //Add state to all routes

    $stateProvider.state('start', {
      url: '/',
      templateUrl: './app/components/start/start.html' + '?' + d,
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
        $cookies.remove('user', { path: '/' });
        $rootScope.user = {};
        $state.go('start', {}, { reload: true });
      }
    });

    /* Add states */
	$stateProvider.state('daymap', {
		url: '/daymap',
		templateUrl: './app/components/daymap/daymap.html',
		controller: 'daymapController',
		controllerAs: 'vm'
	});
	$stateProvider.state('today', {
		url: '/today',
		templateUrl: './app/components/today/today.html' + '?' + d,
		controller: 'todayController',
		controllerAs: 'vm'
	});
	$stateProvider.state('sap', {
		url: '/sap',
		templateUrl: './app/components/sap/sap.html' + '?' + d,
		controller: 'sapController',
		controllerAs: 'vm'
	});
    $stateProvider.state('dayreport', {
      url: '/dayreport',
      params: { datum: null, place: null },
      templateUrl: './app/components/dayreport/dayreport.html' + '?' + d,
      controller: 'dayreportController',
      controllerAs: 'vm'
    });

  }
  ConfigFunction.$inject = ['$urlRouterProvider', '$stateProvider'];
  return ConfigFunction;
});
