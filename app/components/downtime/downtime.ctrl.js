define([], function () {
  'use strict';
  function Controller(downtimeService, $cookies, $state, $rootScope, $filter) {
    var vm = this;
    vm.startdate=$filter('date')(new Date().getTime()-(14*24*3600*1000),'yyyy-MM-dd');
    vm.enddate=$filter('date')(new Date(),'yyyy-MM-dd');
    vm.data=[]

    function load(){
      vm.data=[]
      downtimeService.get(vm.startdate, vm.enddate).then(function (response) {
        vm.data= response.data;
        console.log(vm.data);
      });
    }

    activate();

    function activate() {
      (!$cookies.getObject('user') ? $state.go('login') : $rootScope.user = $cookies.getObject('user'));
      load();
    }
  }
  Controller.$inject = ['downtimeService', '$cookies', '$state', '$rootScope', '$filter'];
  return Controller;
});
