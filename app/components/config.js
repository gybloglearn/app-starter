define([], function () {
  'use strict';
  function ConfigFunction($urlRouterProvider, $stateProvider) {
    $urlRouterProvider.otherwise('/');

    // add cachepreventer
		var da = new Date().getTime().toString().substr(-5);
		//Add state to all routes
		
    $stateProvider.state('start', {
      url: '/',
      templateUrl: './app/components/start/start.html' + '?' + da,
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
	$stateProvider.state('today', {
		url: '/today',
		templateUrl: './app/components/today/today.html' + '?' + da,
		controller: 'todayController',
		controllerAs: 'vm'
	});
	$stateProvider.state('sap', {
		url: '/sap',
		templateUrl: './app/components/sap/sap.html' + '?' + da,
		controller: 'sapController',
		controllerAs: 'vm'
	});
    $stateProvider.state('dayreport', {
      url: '/dayreport',
      params: { datum: null, place: null },
      templateUrl: './app/components/dayreport/dayreport.html' + '?' + da,
      controller: 'dayreportController',
      controllerAs: 'vm'
    });

  }
  ConfigFunction.$inject = ['$urlRouterProvider', '$stateProvider'];
  return ConfigFunction;
});
