define([], function () {
  'use strict';
  function Controller($filter, projectService, $timeout) {
    var vm = this;
    // add comment to this to check 
    vm.datum = $filter('date')(new Date(), 'yyyy-MM-dd HH:mm');
    vm.hatarido = $filter('date')(new Date().getTime()+(28*24*3600*1000), 'yyyy-MM-dd');
    vm.showmessage = false;
    vm.save = save;

    function save(){
      vm.data.id=new Date().getTime();
      vm.data.due=new Date().getTime()+(28*24*3600*1000);
      projectService.post(vm.data).then(function(resp){
        vm.showmessage = true;
        vm.showtitle = vm.data.name;
        vm.data = {};
        $timeout(function(){
          vm.showmessage = false;
          vm.showtitle = '';
        },5000);
      });

    }

    activate();
    vm.project = [];
    function activate() {
      projectService.getAll().then(function(resp){
        vm.project=resp.data;
      });

    }

  }

  Controller.$inject = ['$filter','projectsService','$timeout'];
  return Controller;
});