define([], function () {
  'use strict';
  function Controller($filter,projectService) {
    var vm = this;

    activate();
    vm.project = [];
    function activate() {
      projectService.getAll().then(function (resp) {
        vm.project = resp.data;
      });
    }

  }
  Controller.$inject = ['$filter','projectsService'];
  return Controller;
});