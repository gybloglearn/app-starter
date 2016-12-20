define([], function () {
  'use strict';
  function Controller($filter, sprintService, $stateParams, $timeout, $cookies, $rootScope) {
    var vm = this;
    vm.newSprint = newSprint;
    vm.actProject = {};
    vm.showmessage = false
    vm.data = {};

    function newSprint() {
      vm.data.id = new Date().getTime();
      vm.data.due = new Date().getTime() + (14 * 24 * 3600 * 1000);
      vm.data.project = vm.actProject.id;
      vm.data.projectname = vm.actProject.name;

      sprintService.post(vm.data).then(function (resp) {
        vm.showmessage = true;
        vm.showtitle = vm.data.id;
        vm.data = {};
        $timeout(function () {
          vm.showmessage = false;
          vm.showtitle = '';
        }, 5000);
      });
    }

    activate();

    vm.sprint = [];
    function activate() {
      (!$cookies.getObject('user') ? $state.go('login') : $rootScope.user = $cookies.getObject('user'));
      if ($rootScope.user.username != "212434909" && $rootScope.user.username != "502678184") {
        $state.go('Forbidden');
      }
      if ($stateParams.project) {
        vm.actProject = $stateParams.project;      
      } else {
        vm.deatailsShow = true;
            vm.actProject = null;
      }
      sprintService.getAll().then(function (resp) {
        vm.sprint = resp.data;
      });
    }

  }
  Controller.$inject = ['$filter', 'sprintService', '$stateParams', '$timeout', '$cookies', '$rootScope'];
  return Controller;
});