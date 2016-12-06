define([], function () {
  'use strict';
  function Controller($filter, tasksService) {
    var vm = this;
    vm.azon = new Date().getTime();
    vm.datum = $filter('date')(new Date(), 'yyyy-MM-dd');
    vm.hatarido = $filter('date')(new Date().getTime()+(28*24*3600*1000), 'yyyy-MM-dd');

    activate();
    vm.tasks = [];
    function activate() {
      tasksService.getAll().then(function(resp){
        vm.tasks=resp.data;
        console.log(vm.tasks);
      });

    }
    console.log(vm.azon);
    console.log(vm.hatarido);
  }
  Controller.$inject = ['$filter','tasksService'];
  return Controller;
});