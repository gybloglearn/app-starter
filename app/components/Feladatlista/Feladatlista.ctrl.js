define([], function () {
  'use strict';
  function Controller($filter,tasksService,$cookies,$rootScope,$state,sprintService) {
    var vm = this;
    vm.updatetask=updatetask;

    activate();
    vm.task = [];
    vm.sprint=[];
    function activate() {
      (!$cookies.getObject('user')?$state.go('login'):$rootScope.user=$cookies.getObject('user'));
      tasksService.getAll().then(function (resp) {
        vm.task = resp.data;
      });

      sprintService.getAll().then(function(resp){
      vm.sprint=resp.data;});
    }

     function updatetask() {
            tasksService.put(vm.edit).then(function (resp) {
                vm.edit = '';
            });
        }


  }
  Controller.$inject = ['$filter','tasksService','$cookies','$rootScope','$state','sprintService'];
  return Controller;
});