define([], function () {
  'use strict';
  function Controller($filter,tasksService,$cookies,$rootScope,$state) {
    var vm = this;
    vm.updatetask=updatetask;

    activate();
    vm.task = [];
    function activate() {
      (!$cookies.getObject('user')?$state.go('login'):$rootScope.user=$cookies.getObject('user'));
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
  Controller.$inject = ['$filter','tasksService','$cookies','$rootScope','$state'];
  return Controller;
});