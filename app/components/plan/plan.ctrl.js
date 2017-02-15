define([], function () {
  'use strict';
  function Controller(planService, $timeout, $filter, $cookies, $state, $rootScope) {
    var vm = this;
    vm.show = show;
    vm.save = save;
    vm.mutat = false;
    vm.showmessage = false;
    vm.sheetmakers = ["SheetMaker1", "SheetMaker2", "SheetMaker4", "SheetMaker5", "SheetMaker6", "SheetMaker7", "SheetMaker8", "SheetMaker9"];
    vm.act = "SheetMaker4";
    vm.moduls = [];

    function show() {
      vm.datumok = [];
      vm.mezoszam = ((new Date(vm.dateto).getTime() - new Date(vm.datefrom).getTime()) / (1000 * 3600 * 24)) + 1;
      vm.mutat = true;
      for (var i = 0; i < vm.mezoszam; i++) {
        vm.datumok[i] = new Date(vm.datefrom).getTime() + (i * 24 * 3600 * 1000);
        vm.datumok[i] = $filter('date')(vm.datumok[i], 'yyyy-MM-dd');
      }
    }

    function save() {
      planService.post(vm.data).then(function (response) {
        vm.showmessage = true;
        vm.data = {};
        $timeout(function () {
          vm.showmessage = false;
          vm.showtitle = 'Sikeres feltöltés';
        }, 5000);
      });
    }

    activate();

    function activate() {
      (!$cookies.getObject('user') ? $state.go('login') : $rootScope.user = $cookies.getObject('user'));
      vm.datefrom = new Date().getTime();
      vm.sdate = new Date().getTime();
      vm.dateto = $filter('date')(vm.datefrom + 7 * 24 * 3600 * 1000, 'yyyy-MM-dd');
      vm.datefrom = $filter('date')(vm.datefrom, 'yyyy-MM-dd');
      planService.getpartnumber().then(function (response) {
        vm.moduls = response.data;
        console.log(vm.moduls);
      });

    }
  }
  Controller.$inject = ['planService', '$timeout', '$filter', '$cookies', '$state', '$rootScope'];
  return Controller;
});