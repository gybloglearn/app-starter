define([], function () {
  'use strict';
  function Controller(dataService, $cookies, $state, $rootScope, $filter) {
    var vm = this;
    vm.sm4 = [];
    vm.sm5 = [];
    vm.sm6 = [];
    vm.sm7 = [];
    vm.sm8 = [];
    vm.sm9 = [];
    vm.szakok = [];
    vm.osszeslap = [];
    vm.jolap = [];
    vm.actszak = "";
    vm.actshiftnum = null;
    vm.sheetmakers = ["SheetMaker4", "SheetMaker5", "SheetMaker6", "SheetMaker7", "SheetMaker8","SheetMaker9"];
    vm.datum = $filter('date')(new Date(), 'yyyy-MM-dd');
    vm.datumszam = $filter('date')(new Date(), 'yyyy-MM-dd HH:mm');
    vm.szakok[0] = $filter('shift')(1, vm.datum);
    vm.szakok[1] = $filter('shift')(2, vm.datum);
    vm.szakok[2] = $filter('shift')(3, new Date().getTime() - ((5 * 60 + 50) * 60 * 1000));
    vm.load = load;
    console.log(vm.szakok);

    function load() {
      vm.sm4 = [];
      vm.sm5 = [];
      vm.sm6 = [];
      vm.sm7 = [];
      vm.sm8 = [];
      vm.osszeslap = [0, 0, 0, 0, 0,0];
      vm.jolap = [0, 0, 0, 0, 0,0];
      var substring1 = "TOTAL";
      var substring2 = "GOOD-GOOD";

      dataService.get(vm.sheetmakers[0], vm.datum).then(function (response) {
        vm.sm4 = response.data;
        for (var i = 0; i < vm.sm4.length; i++) {
          if (vm.sm4[i].name.includes(substring1) && vm.actshiftnum == vm.sm4[i].shiftnum) {
            vm.osszeslap[0] = vm.osszeslap[0] + vm.sm4[i].amount;
          }
          else if (vm.sm4[i].name.includes(substring2) && vm.actshiftnum == vm.sm4[i].shiftnum) {
            vm.jolap[0] = vm.jolap[0] + vm.sm4[i].amount;
          }
        }
      });
      dataService.get(vm.sheetmakers[1], vm.datum).then(function (response) {
        vm.sm5 = response.data;
        for (var i = 0; i < vm.sm5.length; i++) {
          if (vm.sm5[i].name.includes(substring1) && vm.actshiftnum == vm.sm5[i].shiftnum) {
            vm.osszeslap[1] = vm.osszeslap[1] + vm.sm5[i].amount;
          }
          else if (vm.sm5[i].name.includes(substring2) && vm.actshiftnum == vm.sm5[i].shiftnum) {
            vm.jolap[1] = vm.jolap[1] + vm.sm5[i].amount;
          }
        }
      });
      dataService.get(vm.sheetmakers[2], vm.datum).then(function (response) {
        vm.sm6 = response.data;
        for (var i = 0; i < vm.sm6.length; i++) {
          if (vm.sm6[i].name.includes(substring1) && vm.actshiftnum == vm.sm6[i].shiftnum) {
            vm.osszeslap[2] = vm.osszeslap[2] + vm.sm6[i].amount;
          }
          else if (vm.sm6[i].name.includes(substring2) && vm.actshiftnum == vm.sm6[i].shiftnum) {
            vm.jolap[2] = vm.jolap[2] + vm.sm6[i].amount;
          }
        }
      });
      dataService.get(vm.sheetmakers[3], vm.datum).then(function (response) {
        vm.sm7 = response.data;
        for (var i = 0; i < vm.sm7.length; i++) {
          if (vm.sm7[i].name.includes(substring1) && vm.actshiftnum == vm.sm7[i].shiftnum) {
            vm.osszeslap[3] = vm.osszeslap[3] + vm.sm7[i].amount;
          }
          else if (vm.sm7[i].name.includes(substring2) && vm.actshiftnum == vm.sm7[i].shiftnum) {
            vm.jolap[3] = vm.jolap[3] + vm.sm7[i].amount;
          }
        }
      });
      dataService.get(vm.sheetmakers[4], vm.datum).then(function (response) {
        vm.sm8 = response.data;
        for (var i = 0; i < vm.sm8.length; i++) {
          if (vm.sm8[i].name.includes(substring1) && vm.actshiftnum == vm.sm8[i].shiftnum) {
            vm.osszeslap[4] = vm.osszeslap[4] + vm.sm8[i].amount;
          }
          else if (vm.sm8[i].name.includes(substring2) && vm.actshiftnum == vm.sm8[i].shiftnum) {
            vm.jolap[4] = vm.jolap[4] + vm.sm8[i].amount;
          }
        }
      });
      dataService.get(vm.sheetmakers[5], vm.datum).then(function (response) {
        vm.sm9 = response.data;
        for (var i = 0; i < vm.sm9.length; i++) {
          if (vm.sm9[i].name.includes(substring1) && vm.actshiftnum == vm.sm9[i].shiftnum) {
            vm.osszeslap[5] = vm.osszeslap[5] + vm.sm9[i].amount;
          }
          else if (vm.sm9[i].name.includes(substring2) && vm.actshiftnum == vm.sm9[i].shiftnum) {
            vm.jolap[5] = vm.jolap[5] + vm.sm9[i].amount;
          }
        }
      });
    }

    activate();

    function activate() {
      (!$cookies.getObject('user') ? $state.go('login') : $rootScope.user = $cookies.getObject('user'));
      choose();
      load();
    }

    function choose() {
      var hour = new Date().getHours();
      var minute = new Date().getMinutes();
      if ((hour == 5 && minute >= 50) || (hour < 13) || (hour == 13 && minute < 50)) {
        vm.actszak = vm.szakok[0];
        vm.actshiftnum = 1;
      }
      else if ((hour == 13 && minute >= 50) || (hour < 21) || (hour == 21 && minute < 50)) {
        vm.actszak = vm.szakok[1];
        vm.actshiftnum = 2;
      }
      else if ((hour == 21 && minute >= 50) || (hour > 21) || (hour < 5) || (hour == 5 && minute < 50)) {
        vm.actszak = vm.szakok[2];
        vm.actshiftnum = 3;
      }
    }
  }
  Controller.$inject = ['dataService', '$cookies', '$state', '$rootScope', '$filter'];
  return Controller;
});
