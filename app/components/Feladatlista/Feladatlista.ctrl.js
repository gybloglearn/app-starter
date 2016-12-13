define([], function () {
  'use strict';
  function Controller($filter,tasksService) {
    var vm = this;
    vm.updatetask=updatetask;

    activate();
    vm.task = [];
    function activate() {
      tasksService.getAll().then(function (resp) {
        vm.task = resp.data;
      });
    }

     function updatetask() {
            tasksService.put(vm.edit).then(function (resp) {
                vm.edit = '';
            });
        }


  }
  Controller.$inject = ['$filter','tasksService'];
  return Controller;
});