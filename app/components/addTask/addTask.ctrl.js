define([], function () {
  'use strict';
  function Controller($filter,tasksService,$cookies,$rootScope,$state) {
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
      (!$cookies.getObject('user')?$state.go('login'):$rootScope.user=$cookies.getObject('user'));
      vm.data = {};
      vm.data.coder=$rootScope.user.displayname;
      tasksService.getAll().then(function (resp) {
        vm.task = resp.data;
      });
    }

  }

  Controller.$inject = ['$filter','tasksService','$cookies','$rootScope','$state'];
  return Controller;
});