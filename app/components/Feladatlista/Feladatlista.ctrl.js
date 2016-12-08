define([], function () {
  'use strict';
  function Controller($filter,tasksService) {
    var vm = this;

    activate();
    vm.task = [];
    function activate() {
      tasksService.getAll().then(function (resp) {
        vm.task = resp.data;
      });
    }

  }
  Controller.$inject = ['$filter','tasksService'];
  return Controller;
});