define([], function () {
  'use strict';
  function Controller($filter, projectService, $state, $rootScope, $cookies, sprintService) {
    var vm = this;
    vm.updateproject = updateproject;
    vm.addSprint = addSprint;
    vm.checksp=checksp;

    function addSprint(project) {
      $state.go('Sprint', { project: project });
    }

    vm.order = 'status';
    activate();
    vm.project = [];
    vm.sprint = [];
    vm.actsprint =[];

    function activate() {
      (!$cookies.getObject('user') ? $state.go('login') : $rootScope.user = $cookies.getObject('user'));
      projectService.getAll().then(function (resp) {
        vm.project = resp.data;
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

    function checksp(id)
    {
      var insp = true;
      angular.forEach(vm.actsprint, function(v, k){
        console.log(v.project);
        (v.project == id)?insp = true:insp=false;
      });
      return insp;
    }
  }
  Controller.$inject = ['$filter', 'projectsService', '$state', '$rootScope', '$cookies', 'sprintService'];
  return Controller;
});