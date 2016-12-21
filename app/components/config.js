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
	$cookies.remove('user');
	$rootScope.user = {};
	$state.go('start', {}, {reload: true});
      }
    });

    /* Add states */
	$stateProvider.state('Projekt', {
		url: '/Projekt',
		params: {project: null},
		templateUrl: './app/components/Projekt/Projekt.html',
		controller: 'ProjektController',
		controllerAs: 'vm'
	});
	$stateProvider.state('Forbidden', {
		url: '/403Forbidden',
		templateUrl: './app/components/Forbidden/Forbidden.html',
		controller: 'ForbiddenController',
		controllerAs: 'vm'
	});
	$stateProvider.state('Sprint', {
		url: '/Sprint',
		params: {project: null},
		templateUrl: './app/components/Sprint/Sprint.html',
		controller: 'SprintController',
		controllerAs: 'vm'
	});
 $stateProvider.state('Feladatlista', {
		url: '/Feladatlista',
		templateUrl: './app/components/Feladatlista/Feladatlista.html',
		controller: 'FeladatlistaController',
		controllerAs: 'vm'
	});
	$stateProvider.state('addTask', {
		url: '/addTask',
		templateUrl: './app/components/addTask/addTask.html',
		controller: 'addTaskController',
		controllerAs: 'vm'
	});
 
	$stateProvider.state('Projektlista', {
		url: '/Projektlista',
		templateUrl: './app/components/Projektlista/Projektlista.html',
		controller: 'ProjektlistaController',
		controllerAs: 'vm'
	});
    $stateProvider.state('addProject', {
      url: '/addProject',
      templateUrl: './app/components/addProject/addProject.html',
      controller: 'addProjectController',
      controllerAs: 'vm'
    });
  }
  ConfigFunction.$inject = ['$urlRouterProvider', '$stateProvider'];
  return ConfigFunction;
});
