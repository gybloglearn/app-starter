define([], function () {
  'use strict';
  function Controller($filter,projectService, $state) {
    var vm = this;
    vm.updateproject = updateproject;
    vm.addSprint = addSprint;

    function addSprint(project){
      $state.go('Sprint', {project: project});
    }
    
    vm.order = 'status';
    activate();
    vm.project = [];
    function activate() {
      projectService.getAll().then(function (resp) {
        vm.project = resp.data;
      });
    }

     function updateproject() {
            tasksService.put(vm.edit).then(function (resp) {
                vm.edit = '';
            });
        }

  }
  Controller.$inject = ['$filter','projectsService','$state'];
  return Controller;
});