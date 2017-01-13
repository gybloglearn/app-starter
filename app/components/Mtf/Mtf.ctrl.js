define([], function () {
  'use strict';
  function Controller(MtfService, $cookies, $state, $rootScope, $filter) {
    var vm = this;
    vm.mtf = [];
    vm.kihozatal_de = [];
    vm.kihozatal_du = [];
    vm.kihozatal_ej = [];
    vm.bokes_de = [];
    vm.bokes_du = [];
    vm.bokes_ej = [];
    vm.sumkihozatal_de_aeq = 0;
    vm.sumkihozatal_du_aeq = 0;
    vm.sumkihozatal_ej_aeq = 0;
    vm.sumbokes_de = 0;
    vm.sumbokes_du = 0;
    vm.sumbokes_ej = 0;
    vm.datum = $filter('date')(new Date(), 'yyyy-MM-dd');
    vm.linktoday = $filter('date')(new Date() - (1000 * 3600) + (15 * 60 * 1000), 'MMddHH');
    vm.linkoldday = $filter('date')(vm.datum, 'MMdd');
    vm.datumszam = vm.datum;
    vm.today_load = today_load;
    vm.oldday_load = oldday_load;

    vm.datszam = csere;
    function csere() {
      vm.szam = new Date(vm.datum);
      vm.datumszam = $filter('date')(vm.szam, 'yyyy-MM-dd');
    }

    function today_load(linktoday) {
      vm.kihozatal_de = [];
      vm.kihozatal_du = [];
      vm.kihozatal_ej = [];
      vm.bokes_de = [];
      vm.bokes_du = [];
      vm.bokes_ej = [];
      vm.sumkihozatal_de_aeq = 0;
      vm.sumkihozatal_du_aeq = 0;
      vm.sumkihozatal_ej_aeq = 0;
      vm.sumbokes_de = 0;
      vm.sumbokes_du = 0;
      vm.sumbokes_ej = 0;
      var j = 0;
      var k = 0;
      var l = 0;
      var m = 0;
      var n = 0;
      var o = 0;
      vm.datum = $filter('date')(new Date(), 'yyyy-MM-dd');
      vm.mtf = [];

      MtfService.gettoday(linktoday).then(function (response) {
        vm.mtf = response.data[0].data;

        for (var i = 0; i < vm.mtf.length; i++) {
          var mystring = vm.mtf[i].name;
          var substring1 = "_BP-OUT";
          var substring2 = "_BOK-BOKES";

          if (mystring.includes(substring1) && vm.mtf[i].shiftnum == 1) {
            vm.kihozatal_de[j] = vm.mtf[i];
            vm.kihozatal_de[j].name = mystring.substr(0, mystring.length - 7);
            for (var a = 0; a < vm.aeqs.length; a++) {
              if (vm.kihozatal_de[j].name == vm.aeqs[a].name) {
                vm.kihozatal_de[j].aeq = vm.kihozatal_de[j].amount * vm.aeqs[a].amount;
              }
            }
            j++
          }
          else if (mystring.includes(substring2) && vm.mtf[i].shiftnum == 1) {
            vm.bokes_de[k] = vm.mtf[i];
            vm.bokes_de[k].name = mystring.substr(0, mystring.length - 10);
            vm.bokes_de[k].name=$filter('change')(vm.bokes_de[k].name);
            for (var b = 0; b < vm.kihozatal_de.length; b++) {
              if (vm.kihozatal_de[b].name == vm.bokes_de[k].name) {
                vm.bokes_de[k].aeq = vm.kihozatal_de[b].aeq;
              }
            }
            k++
          }
          else if (mystring.includes(substring1) && vm.mtf[i].shiftnum == 2) {
            vm.kihozatal_du[l] = vm.mtf[i];
            vm.kihozatal_du[l].name = mystring.substr(0, mystring.length - 7);
            for (var a = 0; a < vm.aeqs.length; a++) {
              if (vm.kihozatal_du[l].name == vm.aeqs[a].name) {
                vm.kihozatal_du[l].aeq = vm.kihozatal_du[l].amount * vm.aeqs[a].amount;
              }
            }
            l++
          }
          else if (mystring.includes(substring2) && vm.mtf[i].shiftnum == 2) {
            vm.bokes_du[m] = vm.mtf[i];
            vm.bokes_du[m].name = mystring.substr(0, mystring.length - 10);
            vm.bokes_du[m].name=$filter('change')(vm.bokes_du[m].name);
            for (var b = 0; b < vm.kihozatal_du.length; b++) {
              if (vm.kihozatal_du[b].name == vm.bokes_du[m].name) {
                vm.bokes_du[m].aeq = vm.kihozatal_du[b].aeq;
              }
            }
            m++
          }
          else if (mystring.includes(substring1) && vm.mtf[i].shiftnum == 3) {
            vm.kihozatal_ej[n] = vm.mtf[i];
            vm.kihozatal_ej[n].name = mystring.substr(0, mystring.length - 7);
            for (var a = 0; a < vm.aeqs.length; a++) {
              if (vm.kihozatal_ej[n].name == vm.aeqs[a].name) {
                vm.kihozatal_ej[n].aeq = vm.kihozatal_ej[n].amount * vm.aeqs[a].amount;
              }
            }
            n++
          }
          else if (mystring.includes(substring2) && vm.mtf[i].shiftnum == 3) {
            vm.bokes_ej[o] = vm.mtf[i];
            vm.bokes_ej[o].name = mystring.substr(0, mystring.length - 10);
            vm.bokes_ej[o].name=$filter('change')(vm.bokes_ej[o].name);
            for (var b = 0; b < vm.kihozatal_ej.length; b++) {
              if (vm.kihozatal_ej[b].name == vm.bokes_ej[o].name) {
                vm.bokes_ej[o].aeq = vm.kihozatal_ej[b].aeq;
              }
            }
            o++
          }
        }

        vm.sumkihozatal_de_aeq = $filter('sumaeq')(vm.kihozatal_de);
        vm.sumbokes_de = $filter('sumdb')(vm.bokes_de);
        vm.sumkihozatal_du_aeq = $filter('sumaeq')(vm.kihozatal_du);
        vm.sumbokes_du = $filter('sumdb')(vm.bokes_du);
        vm.sumkihozatal_ej_aeq = $filter('sumaeq')(vm.kihozatal_ej);
        vm.sumbokes_ej = $filter('sumdb')(vm.bokes_ej);
      });
    }

    function oldday_load(linkoldday) {
      vm.kihozatal_de = [];
      vm.kihozatal_du = [];
      vm.kihozatal_ej = [];
      vm.bokes_de = [];
      vm.bokes_du = [];
      vm.bokes_ej = [];
      vm.sumkihozatal_de_aeq = 0;
      vm.sumkihozatal_du_aeq = 0;
      vm.sumkihozatal_ej_aeq = 0;
      vm.sumbokes_de = 0;
      vm.sumbokes_du = 0;
      vm.sumbokes_ej = 0;
      var j = 0;
      var k = 0;
      var l = 0;
      var m = 0;
      var n = 0;
      var o = 0;
      linkoldday = $filter('date')(new Date(vm.datum).getTime() + (24 * 3600 * 1000), 'MMdd');
      vm.mtf = [];

      MtfService.getoldday(linkoldday).then(function (response) {
        vm.mtf = response.data[0].data;

        for (var i = 0; i < vm.mtf.length; i++) {
          var mystring = vm.mtf[i].name;
          var substring1 = "_BP-OUT";
          var substring2 = "_BOK-BOKES";

          if (mystring.includes(substring1) && vm.mtf[i].shiftnum == 1) {
            vm.kihozatal_de[j] = vm.mtf[i];
            vm.kihozatal_de[j].name = mystring.substr(0, mystring.length - 7);
            for (var a = 0; a < vm.aeqs.length; a++) {
              if (vm.kihozatal_de[j].name == vm.aeqs[a].name) {
                vm.kihozatal_de[j].aeq = vm.kihozatal_de[j].amount * vm.aeqs[a].amount;
              }
            }
            j++
          }
         else if (mystring.includes(substring2) && vm.mtf[i].shiftnum == 1) {
            vm.bokes_de[k] = vm.mtf[i];
            vm.bokes_de[k].name = mystring.substr(0, mystring.length - 10);
            vm.bokes_de[k].name=$filter('change')(vm.bokes_de[k].name);
            for (var b = 0; b < vm.kihozatal_de.length; b++) {
              if (vm.kihozatal_de[b].name == vm.bokes_de[k].name) {
                vm.bokes_de[k].aeq = vm.kihozatal_de[b].aeq;
              }
            }
            k++
          }
          else if (mystring.includes(substring1) && vm.mtf[i].shiftnum == 2) {
            vm.kihozatal_du[l] = vm.mtf[i];
            vm.kihozatal_du[l].name = mystring.substr(0, mystring.length - 7);
            for (var a = 0; a < vm.aeqs.length; a++) {
              if (vm.kihozatal_du[l].name == vm.aeqs[a].name) {
                vm.kihozatal_du[l].aeq = vm.kihozatal_du[l].amount * vm.aeqs[a].amount;
              }
            }
            l++
          }
         else if (mystring.includes(substring2) && vm.mtf[i].shiftnum == 2) {
            vm.bokes_du[m] = vm.mtf[i];
            vm.bokes_du[m].name = mystring.substr(0, mystring.length - 10);
            vm.bokes_du[m].name=$filter('change')(vm.bokes_du[m].name);
            for (var b = 0; b < vm.kihozatal_du.length; b++) {
              if (vm.kihozatal_du[b].name == vm.bokes_du[m].name) {
                vm.bokes_du[m].aeq = vm.kihozatal_du[b].aeq;
              }
            }
            m++
          }
          else if (mystring.includes(substring1) && vm.mtf[i].shiftnum == 3) {
            vm.kihozatal_ej[n] = vm.mtf[i];
            vm.kihozatal_ej[n].name = mystring.substr(0, mystring.length - 7);
            for (var a = 0; a < vm.aeqs.length; a++) {
              if (vm.kihozatal_ej[n].name == vm.aeqs[a].name) {
                vm.kihozatal_ej[n].aeq = vm.kihozatal_ej[n].amount * vm.aeqs[a].amount;
              }
            }
            n++
          }
          else if (mystring.includes(substring2) && vm.mtf[i].shiftnum == 3) {
            vm.bokes_ej[o] = vm.mtf[i];
            vm.bokes_ej[o].name = mystring.substr(0, mystring.length - 10);
            vm.bokes_ej[o].name=$filter('change')(vm.bokes_ej[o].name);
            for (var b = 0; b < vm.kihozatal_ej.length; b++) {
              if (vm.kihozatal_ej[b].name == vm.bokes_ej[o].name) {
                vm.bokes_ej[o].aeq = vm.kihozatal_ej[b].aeq;
              }
            }
            o++
          }
        }
        vm.sumkihozatal_de_aeq = $filter('sumaeq')(vm.kihozatal_de);
        vm.sumbokes_de = $filter('sumdb')(vm.bokes_de);
        vm.sumkihozatal_du_aeq = $filter('sumaeq')(vm.kihozatal_du);
        vm.sumbokes_du = $filter('sumdb')(vm.bokes_du);
        vm.sumkihozatal_ej_aeq = $filter('sumaeq')(vm.kihozatal_ej);
        vm.sumbokes_ej = $filter('sumdb')(vm.bokes_ej);
      });
    }


    activate();

    function activate() {
      (!$cookies.getObject('user') ? $state.go('login') : $rootScope.user = $cookies.getObject('user'));
      today_load(vm.linktoday);
      //console.log($filter('shift')(1,new Date().getTime()));
    }

    vm.aeqs = [
      { name: "Ds12 FLOW", amount: 0.6 },
      { name: "DS12FLOW", amount: 0.6 },
      { name: "ZW220 CP5", amount: 0.44 },
      { name: "ZW230 FLOW", amount: 0.46 },
      { name: "ZW230 CP5", amount: 0.46 },
      { name: "C11CP5", amount: 0.5 },
      { name: "C11FLOW", amount: 0.5 },
      { name: "C11 FLOW", amount: 0.5 },
      { name: "D11 CP5", amount: 0.68 },
      { name: "D13 CP5", amount: 0.88 },
      { name: "D12 FLOW", amount: 0.74 },
      { name: "D11 FLOW", amount: 0.68 },
      { name: "A27 CP5", amount: 1 },
      { name: "A27 FLOW", amount: 1 },
      { name: "B32 CP5", amount: 1.3 },
      { name: "B32 FLOW", amount: 1.3 },
      { name: "DS- D13 CP5", amount: 0.7 },
      { name: "DS13CP5", amount: 0.7 },
      { name: "ZB500S", amount: 0.6 }
    ];
  }
  Controller.$inject = ['MtfService', '$cookies', '$state', '$rootScope', '$filter'];
  return Controller;
});
