define([], function () {
  'use strict';
  function Controller($filter, tasksService) {
    var vm = this;
    // add comment to this to check 
    vm.datum = $filter('date')(new Date(), 'yyyy-MM-dd HH:mm');
    vm.hatarido = $filter('date')(new Date().getTime()+(28*24*3600*1000), 'yyyy-MM-dd');

    vm.save = save;

    function save(){
      vm.data.id=new Date().getTime();
      tasksService.post(vm.data).then(function(resp){
        console.log(vm.data);
      });

    }

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