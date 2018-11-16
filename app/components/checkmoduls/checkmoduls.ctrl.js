define([], function () {
  'use strict';
  function Controller(checkmodulsService, $cookies, $state, $rootScope, $filter) {
    var vm = this;
    vm.years=[2018,2019];
    vm.qual=["A","B"];
    vm.moduls = [
      { Label: "ZW1500-RL,600", Values: 3147303 },
      { Label: "MODULE,ZW1500,CLAMP", Values: 3157651 },
      { Label: "ZW1500 RMS adapteres", Values: 3157805 },
      { Label: "MODULE,ZW1500X,CLAMP", Values: 3157806 },
      { Label: "Module ZW 1500 X RMS", Values: 3161831 },
  ];

    function load(){
      vm.data=[];
      checkmodulsService.get().then(function (response){
        vm.data=response.data;
        for(var i=0;i<vm.data.length;i++){
          vm.data[i].inyear=new Date(vm.data[i].indate).getFullYear();
        }
        console.log(vm.data);
      });
    }

    activate();

    function activate() {
      (!$cookies.getObject('user') ? $state.go('login') : $rootScope.user = $cookies.getObject('user'));
      load();
    }
  }
  Controller.$inject = ['checkmodulsService', '$cookies', '$state', '$rootScope', '$filter'];
  return Controller;
});