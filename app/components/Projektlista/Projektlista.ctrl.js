define([], function () {
  'use strict';
  function Controller($filter, projectService, $state, $rootScope, $cookies, sprintService) {
    var vm = this;
    vm.updateproject = updateproject;
    vm.addSprint = addSprint;
    vm.checksp = checksp;

    function addSprint(project) {
      $state.go('Sprint', { project: project });
    }

    vm.order = 'status';
    activate();
    vm.project = [];
    vm.sprint = [];
    vm.actsprint = [];

    function activate() {
      (!$cookies.getObject('user') ? $state.go('login') : $rootScope.user = $cookies.getObject('user'));
      projectService.getAll().then(function (resp) {
        if ($rootScope.user.username != "212434909" && $rootScope.user.username != "502678184") {
          vm.project = $filter('filter')(resp.data, { 'responsible': $rootScope.user.displayname });
        }
        else{
          vm.project=resp.data;
        }
      });

      sprintService.getAll().then(function (resp) {
        vm.sprint = resp.data;
        switchsprint();
      });
    }

    function updateproject() {
      tasksService.put(vm.edit).then(function (resp) {
        vm.edit = '';
      });
    }

    function switchsprint() {
      var nowaday = new Date().getTime();
      var j = 0;

      for (var i = 0; i < vm.sprint.length; i++) {
        if (vm.sprint[i].due > nowaday) {
          vm.actsprint[j] = vm.sprint[i];
          j++;
        }
      }
    }

    function checksp(item) {
      var insp = false;
      for (var i = 0; i < vm.actsprint.length; i++) {
        if (vm.actsprint[i].project == item.id) {
          insp = true;
          break;
        }
      }
      return insp;
    }
  }
  Controller.$inject = ['$filter', 'projectsService', '$state', '$rootScope', '$cookies', 'sprintService'];
  return Controller;
});