define([], function () {
  'use strict';
  function Controller(planService,$filter) {
    var vm = this;
    vm.show = show;
    vm.mutat = false;
    vm.sheetmakers = ["SheetMaker4", "SheetMaker5", "SheetMaker6", "SheetMaker7", "SheetMaker8"];
    vm.act = "SheetMaker4";
    vm.egyedi=[];

    function show() {
      vm.datumok = [];
      vm.mezoszam = ((new Date(vm.dateto).getTime() - new Date(vm.datefrom).getTime()) / (1000 * 3600 * 24)) + 1;
      vm.mutat = true;
      for (var i = 0; i < vm.mezoszam; i++) {
        vm.datumok[i] = new Date(vm.datefrom).getTime() + (i * 24 * 3600 * 1000);
        vm.datumok[i] = $filter('date')(vm.datumok[i], 'yyyy-MM-dd');
      }
      console.log(vm.mezoszam);
      console.log(vm.datumok);
      console.log(vm.act);
    }

    activate();

    function activate() {
      vm.datefrom = new Date().getTime();
      vm.sdate = new Date().getTime();
      vm.dateto = $filter('date')(vm.datefrom + 7 * 24 * 3600 * 1000, 'yyyy-MM-dd');
      vm.datefrom = $filter('date')(vm.datefrom, 'yyyy-MM-dd');
      planService.getpartnumber().then(function (response) {
        vm.egyedi = response.data;
      });

    }
  }
  Controller.$inject = ['planService','$filter'];
  return Controller;
});