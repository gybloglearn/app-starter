define([], function () {
  'use strict';
  function Controller($filter,projectService) {
    var vm = this;
    vm.updateproject = updateproject;

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
  Controller.$inject = ['$filter','projectsService'];
  return Controller;
});