define([], function () {
  'use strict';
  function Controller(dryService, $cookies, $state, $rootScope) {
    var vm = this;
    vm.drydata = [];
    vm.drylist = ["Drying3", "Drying2"];
    vm.actdry = "Drying3";
    vm.load = load;

    function load() {
      vm.drydata = [];
      vm.dis = true;

      dryService.get(vm.actdry).then(function (response) {
        vm.drydata = response.data;
        console.log(vm.drydata);
        vm.dis = false;
      });
    }

    activate();

    function activate() {
      (!$cookies.getObject('user') ? $state.go('login') : $rootScope.user = $cookies.getObject('user'));
      load();
    }
  }
  Controller.$inject = ['dryService', '$cookies', '$state', '$rootScope'];
  return Controller;
});