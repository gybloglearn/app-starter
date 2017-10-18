define([], function () {
  'use strict';
  function Controller(PottingService, $cookies, $state, $rootScope, $filter) {
    var vm = this;
    vm.potting = [];
    vm.mch = "Potting4"
    vm.datum = $filter('date')(new Date(), 'yyyy-MM-dd');
    vm.kezdo = $filter('date')(new Date(vm.datum).getTime() - (24 * 3600 * 1000), 'yyyy-MM-dd');
    vm.allpotting = ["Potting4", "Potting3", "Potting2"];
    vm.load = load;
    vm.datumszam = vm.datum;
    vm.kezdodatumszam = vm.kezdo;
    vm.datszam = beallit;
    vm.helyes = csere;
    vm.szak_de = $filter('shift')(1, vm.datumszam);
    vm.szak_du = $filter('shift')(2, vm.datumszam);
    vm.szak_ej = $filter('shift')(3, vm.datumszam);
    vm.sumdb = [];
    vm.sumaeq = [];

    function beallit() {
      vm.szam = new Date(vm.datum);
      vm.masik = new Date(vm.kezdo);
      vm.datumszam = $filter('date')(vm.szam, 'yyyy-MM-dd');
      vm.kezdodatumszam = $filter('date')(vm.masik, 'yyyy-MM-dd');
      vm.szak_de = $filter('shift')(1, vm.datumszam);
      vm.szak_du = $filter('shift')(2, vm.datumszam);
      vm.szak_ej = $filter('shift')(3, vm.datumszam);
    }

    function csere() {
      if (vm.datum < vm.kezdo) {
        vm.datum = $filter('date')(new Date(), 'yyyy-MM-dd');
        vm.kezdo = $filter('date')(new Date(vm.datum).getTime() - (24 * 3600 * 1000), 'yyyy-MM-dd');
      }
    }

    function load() {
      vm.dis = true;
      vm.potting = [];
      vm.sumdb = [0, 0, 0, 0, 0, 0, 0, 0, 0];
      vm.sumaeq = [0, 0, 0, 0, 0, 0, 0, 0, 0];

      //if (!vm.tobbnapos) {
        PottingService.get(vm.mch, vm.datum).then(function (response) {
          vm.potting = response.data;
          vm.dis = false;
          for (var i = 0; i < vm.potting.length; i++) {
            var mystring = vm.potting[i].type;
            var substring1 = "IN";
            var substring2 = "P3";
            var substring3 = "OUT";
            var db = 0;
            var aeq = 0;

            if (vm.potting[i].category==substring1) {
              for (var j = 0; j < vm.aeqs.length; j++) {
                if (mystring == vm.aeqs[j].name) {
                  vm.potting[i].aeq = vm.potting[i].amount * vm.aeqs[j].amount;
                }
              }
              if (vm.potting[i].shiftnum == 1) {
                vm.sumdb[0] = vm.sumdb[0] + vm.potting[i].amount;
                vm.sumaeq[0] = vm.sumaeq[0] + vm.potting[i].aeq;
              }
              else if (vm.potting[i].shiftnum == 2) {
                vm.sumdb[3] = vm.sumdb[3] + vm.potting[i].amount;
                vm.sumaeq[3] = vm.sumaeq[3] + vm.potting[i].aeq;
              }
              else if (vm.potting[i].shiftnum == 3) {
                vm.sumdb[6] = vm.sumdb[6] + vm.potting[i].amount;
                vm.sumaeq[6] = vm.sumaeq[6] + vm.potting[i].aeq;
              }
            }
            else if (vm.potting[i].category==substring2) {
              for (var j = 0; j < vm.aeqs.length; j++) {
                if (mystring == vm.aeqs[j].name) {
                  vm.potting[i].aeq = vm.potting[i].amount * vm.aeqs[j].amount;
                }
              }
              if (vm.potting[i].shiftnum == 1) {
                vm.sumdb[1] = vm.sumdb[1] + vm.potting[i].amount;
                vm.sumaeq[1] = vm.sumaeq[1] + vm.potting[i].aeq;
              }
              else if (vm.potting[i].shiftnum == 2) {
                vm.sumdb[4] = vm.sumdb[4] + vm.potting[i].amount;
                vm.sumaeq[4] = vm.sumaeq[4] + vm.potting[i].aeq;
              }
              else if (vm.potting[i].shiftnum == 3) {
                vm.sumdb[7] = vm.sumdb[7] + vm.potting[i].amount;
                vm.sumaeq[7] = vm.sumaeq[7] + vm.potting[i].aeq;
              }
            }
            else if (vm.potting[i].category==substring3) {
              for (var j = 0; j < vm.aeqs.length; j++) {
                if (mystring == vm.aeqs[j].name) {
                  vm.potting[i].aeq = vm.potting[i].amount * vm.aeqs[j].amount;
                }
              }
              if (vm.potting[i].shiftnum == 1) {
                vm.sumdb[2] = vm.sumdb[2] + vm.potting[i].amount;
                vm.sumaeq[2] = vm.sumaeq[2] + vm.potting[i].aeq;
              }
              else if (vm.potting[i].shiftnum == 2) {
                vm.sumdb[5] = vm.sumdb[5] + vm.potting[i].amount;
                vm.sumaeq[5] = vm.sumaeq[5] + vm.potting[i].aeq;
              }
              else if (vm.potting[i].shiftnum == 3) {
                vm.sumdb[8] = vm.sumdb[8] + vm.potting[i].amount;
                vm.sumaeq[8] = vm.sumaeq[8] + vm.potting[i].aeq;
              }
            }

            if (vm.potting[i].shiftnum == 1) {
              vm.potting[i].shiftname = $filter('shift')(vm.potting[i].shiftnum, vm.potting[i].days);
            }
            else if (vm.potting[i].shiftnum == 2) {
              vm.potting[i].shiftname = $filter('shift')(vm.potting[i].shiftnum, vm.potting[i].days);
            }
            else if (vm.potting[i].shiftnum == 3) {
              vm.potting[i].shiftname = $filter('shift')(vm.potting[i].shiftnum, vm.potting[i].days);
            }
          }
        });
     // }

      if (vm.tobbnapos) {
        PottingService.getdays(vm.mch, vm.kezdo, vm.datum).then(function (response) {
          vm.potting = response.data;
          vm.dis = false;

          for (var i = 0; i < vm.potting.length; i++) {
            var nowstring = vm.potting[i].name;
            var substring1 = "_IN-IN";
            var substring2 = "_P3-P3";
            var substring3 = "_OUT-OUT";

            if (nowstring.includes(substring1)) {
              nowstring = nowstring.substr(0, nowstring.length - 6);
              for (var j = 0; j < vm.aeqs.length; j++) {
                if (nowstring == vm.aeqs[j].name) {
                  vm.potting[i].aeq = vm.potting[i].amount * vm.aeqs[j].amount;
                }
              }
            }

            else if (nowstring.includes(substring2)) {
              nowstring = nowstring.substr(0, nowstring.length - 6);
              for (var j = 0; j < vm.aeqs.length; j++) {
                if (nowstring == vm.aeqs[j].name) {
                  vm.potting[i].aeq = vm.potting[i].amount * vm.aeqs[j].amount;
                }
              }
            }
            else if (nowstring.includes(substring3)) {
              nowstring = nowstring.substr(0, nowstring.length - 8);
              for (var j = 0; j < vm.aeqs.length; j++) {
                if (nowstring == vm.aeqs[j].name) {
                  vm.potting[i].aeq = vm.potting[i].amount * vm.aeqs[j].amount;
                }
              }
            }
            if (vm.potting[i].shiftnum == 1) {
              vm.potting[i].shiftname = $filter('shift')(1, vm.potting[i].days);
            }
            else if (vm.potting[i].shiftnum == 2) {
              vm.potting[i].shiftname = $filter('shift')(2, vm.potting[i].days);
            }
            else if (vm.potting[i].shiftnum == 3) {
              vm.potting[i].shiftname = $filter('shift')(3, vm.potting[i].days);
            }
          }
        });
      }
    }

    activate();

    function activate() {
      (!$cookies.getObject('user') ? $state.go('login') : $rootScope.user = $cookies.getObject('user'));
      load();
    }
    vm.aeqs = [
      { name: "Ds12 FLOW", amount: 0.6 },
      { name: "DS-D12 FLOW", amount: 0.6 },
      { name: "ZW220 CP5", amount: 0.44 },
      { name: "ZW220 FLOW", amount: 0.44 },
      { name: "ZW230 FLOW", amount: 0.46 },
      { name: "ZW230 CP5", amount: 0.46 },
      { name: "C11CP5", amount: 0.5 },
      { name: "C11 CP5", amount: 0.5 },
      { name: "C11FLOW", amount: 0.5 },
      { name: "C11 FLOW", amount: 0.5 },
      { name: "D11 CP5", amount: 0.68 },
      { name: "D13 CP5", amount: 0.88 },
      { name: "D13 CP", amount: 0.88 },
      { name: "D12 FLOW", amount: 0.74 },
      { name: "D11 FLOW", amount: 0.68 },
      { name: "A27 CP5", amount: 1 },
      { name: "A27_CP5", amount: 1 },
      { name: "A27 FLOW", amount: 1 },
      { name: "A27_FLOW", amount: 1 },
      { name: "B32 CP5", amount: 1.3 },
      { name: "B32_CP5", amount: 1.3 },
      { name: "B32 FLOW", amount: 1.3 },
      { name: "B32_FLOW", amount: 1.3 },
      { name: "DS- D13 CP5", amount: 0.7 },
      { name: "DS-D11 FLOW", amount: 0 },
      { name: "DS-D11 CP5", amount: 0 },
      { name: "DS-D13 CP5", amount: 0.7 },
      { name: "ZB500S", amount: 0.6 },
      { name: "D11 K", amount: 0 },
      { name: "DX", amount: 0.74 }
    ];
  }
  Controller.$inject = ['PottingService', '$cookies', '$state', '$rootScope', '$filter'];
  return Controller;
});
