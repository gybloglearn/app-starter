define([], function () {
  'use strict';
  function Controller($filter, projectService) {
    var vm = this;
    // add comment to this to check 
    vm.datum = $filter('date')(new Date(), 'yyyy-MM-dd HH:mm');
    vm.hatarido = $filter('date')(new Date().getTime()+(28*24*3600*1000), 'yyyy-MM-dd');

    vm.save = save;

    function save(){
      vm.data.id=new Date().getTime();
      vm.data.due=new Date().getTime()+(28*24*3600*1000);
      projectService.post(vm.data).then(function(resp){
        console.log(vm.data);
      });

    }

    activate();
    vm.project = [];
    function activate() {
      projectService.getAll().then(function(resp){
        vm.project=resp.data;
        console.log(vm.project);
      });

    }

    console.log(vm.azon);
    console.log(vm.hatarido);
  }
  Controller.$inject = ['$filter','projectsService'];
  return Controller;
});