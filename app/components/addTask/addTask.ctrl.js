define([], function () {
  'use strict';
  function Controller($filter,tasksService) {
    var vm = this;
    vm.datum = $filter('date')(new Date(), 'yyyy-MM-dd HH:mm');
    vm.showmessage = false;
    vm.savetask = savetask;

    function savetask()
    {
      vm.data.id=new Date().getTime();
       tasksService.post(vm.data).then(function(resp){
         vm.showmessage = true;
         vm.showtitle = vm.data.name;
         vm.data={};
         $timeout(function(){
          vm.showmessage = false;
          vm.showtitle = '';
        },5000);
       });
    }
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